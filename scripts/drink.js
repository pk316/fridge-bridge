$(document).ready(initializeApp);
/***************************************************************************************************
 * initializeApp
 * @params {undefined}
 * @returns: {undefined}
 * initializes the application and loads click handlers
 */
function initializeApp() {
    addClickHandlers();
}
/***************************************************************************************************
 * addClickHandlers
 * @params {undefined}
 * @returns  {undefined}
 * adds click handler + keypress
 */
function addClickHandlers() {
    $('.submit-drink').click(searchDB);
    $('.input-drink').keydown(function(event){
        if (event.keyCode === 13){
            event.preventDefault();
            console.log('enter was pressed');
            $('.submit-drink').click();
        }
    });
    searchAgain();
    backToResult();
}
/***************************************************************************************************
 * searchAgain
 * @params {undefined}
 * @returns  {undefined}
 * resets search bar and clears all list values
 */
function searchAgain() {
    $('.search-again').addClass('mouse-hover').click(function() {
        $('.drink-list').css('display', 'none');
        $('.drink-ing div p').text('');
        $('.drink-ing').css('display', 'none');
        $('.input-drink').val('');
    })
}
/***************************************************************************************************
 * backToResult
 * @params {undefined}
 * @returns  {undefined}
 * after user clicks on drink name and data comes up, clicking back to list will move the page back to drink list
 */
function backToResult() {
    var drinkIng = $('.drink-ing');
    var drinkList = $('.drink-list');
    $('.back-to-list').addClass('mouse-hover').click(function() {
        if (drinkIng.css('display') !== 'none' && drinkList.css('display') === 'none') {
            $('.drink-ing').css('display', 'none');
            $('.drink-list').show();
        }
    });
}
/***************************************************************************************************
 * searchDB
 * @params {undefined}
 * @returns  {undefined}
 * Function to start searching cocktail database
 */
function searchDB() {
    $('.drink-list').css('display', 'none');
    $('.drink-ing div p').text('');
    $('.drink-ing').css('display', 'none');
    searchCocktail();
    add_vids_to_carousel();
}
/***************************************************************************************************
 * displayErrorMessage
 * @params {string}
 * @returns  {undefined}
 * shows modal and text for error
 */
function displayErrorMessage(message){
    $('#error-modal').modal('show');
    $('.modal-body > p').text(message);
}

//------------------------------ cocktailDB ------------------------------//
//-----ajax call error-----//
/***************************************************************************************************
 * errorMessage
 * @params {data object}
 * @returns  {undefined}
 * searches cocktail data base and receives list of drinks containing ingredient user searched for
 */
function errorMessage(data) {
    console.log('server response error');
    console.log(data);
    if (data.status === 200) {
        displayErrorMessage('Invalid data type or URL');
    } else if (data.status === 0) {
        displayErrorMessage('Invalid CocktailDB Ajax method');
    }
}

//-----getting drinks-----//
/***************************************************************************************************
 * searchCocktail
 * @params {undefined}
 * @returns  {undefined}
 * searches cocktail data base and receives list of drinks containing ingredient user searched for
 */
function searchCocktail() {
    var inputText = $('.input-drink').val();
    $.ajax({
        dataType: 'text',
        url: 'http://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + inputText,
        method: 'get',
        success: function(data) {
            var data = JSON.parse(data);
            if (data.drinks.length !== 0) {
                $('.drink-list > ul').empty();
                for (var i = 0; i < data.drinks.length; i++) {
                    var drinkList = data.drinks[i].strDrink;
                    renderDrinkList(drinkList);
                }
                console.log('server response FROM COCKTAILDB: ', data.drinks);
            } else if (data.drinks === 0) {
                displyErrorMessage('No drinks are found with ' + inputText + '. Try "Vodka", "Rum", "Mango"');
            }
        },
        error: errorMessage
    })
}
/***************************************************************************************************
 * renderDrinkList
 * @params {drink data array}
 * @returns  {undefined}
 * loops through drink list and appends to page for cocktailDB
 */
function renderDrinkList(drinkList) {
    $('.drink-list').show();
    var drinkListCt = $('<li>', {
        text: drinkList,
        css: {
            'text-decoration': 'underline',
            cursor: 'pointer'
        }
    }).click(getDataCocktail);
    $('.drink-list > ul').append(drinkListCt);
}
/***************************************************************************************************
 * getDataCocktail
 * @params {undefined}
 * @returns  {undefined}
 * after user picks drink from list, gets data from cocktailDB server about selected drink and prepares for render
 */
function getDataCocktail() {
    var validInput = $(this).text();
    console.log('cocktailDB server called');
    $.ajax({
        dataType: 'JSON',
        url: 'http://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + validInput,
        method: 'get',
        success: function(data) {
            var passData = [];
            var drink = data.drinks[0];
            console.log('server response: ', drink);
            var ingred = [];
            var measurement = [];
            for (var item in drink) {
                if (drink[item] !== null) {
                    if (item.indexOf("Ingredient") !== -1) {
                        if (drink[item].length > 2) {
                            ingred.push(drink[item]);
                        }
                    }
                    if (item.indexOf("Measure") !== -1) {
                        if (drink[item].length > 2) {
                            measurement.push(drink[item]);
                        }
                    }
                }
            }
            for (var i = 0; i < measurement.length; i++) {
                if (measurement[i] === undefined) {
                    var amount = '';
                    ingred[i] += amount;
                } else {
                    amount = '' + ingred[i];
                    measurement[i] += amount;
                }
            }
            if (measurement.length < ingred.length) {
                var lastItem = ingred.length - 1;
                var temp = ingred[lastItem];
                measurement.push(temp);
            }
            var desc = drink.strInstructions;
            var name = drink.strDrink;
            var imgUrl = drink.strDrinkThumb;
            passData.push(measurement, desc, name, imgUrl);
            console.log(passData);
            renderCocktailInfo(passData);
        },
        error: function(data) {
            errorMessage(data);
        }
    })
}
/***************************************************************************************************
 * renderCocktailInfo
 * @params {drink data array}
 * @returns  {undefined}
 * after drink is selected and info is passed along, renders drink info in appropriate divs
 */
function renderCocktailInfo(array) {
    $('.drink-list').css('display', 'none');
    $('.drink-ing').show();
    $('.photo-img').css('background-image', 'url(' + array[3] + ')');
    if (typeof(array[0]) === 'object') {
        $('.ingred-sec > ul').empty();
        var ingredients = array[0];
        for (var j = 0; j < ingredients.length; j++) {
            var ingredientList = $('<li>', {
                text: ingredients[j]
            });
            $('.ingred-sec > ul').append(ingredientList);
        }
    }
    $('.desc-sec p').text(array[1]);
    $('.drink-ing > h2').text(array[2]);
}
