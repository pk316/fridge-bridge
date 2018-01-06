$(document).ready(initializeApp);
/***************************************************************************************************
 * Global Variables
 */
var numberOfDrinkCalls = null;
var totalDrinkCount = 0;
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
    $('.input-drink').keyup(function(event){
        if (event.keyCode === 13){
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
 * one function to start searching both absolut and cocktail database
 */
function searchDB() {
    $('.drink-list').css('display', 'none');
    $('.drink-ing div p').text('');
    $('.drink-ing').css('display', 'none');
    numberOfDrinkCalls = 2;
    getDrinkList();
    searchCocktailDB();
    add_vids_to_carousel();
}
/***************************************************************************************************
 * totalDrinkDataCheck
 * @params {array length}
 * @returns  {undefined}
 * checks data length to see if any data is being sent back from either server
 */
function totalDrinkDataCheck(dataLength){
    totalDrinkCount+=dataLength;
    numberOfDrinkCalls--;
    if(numberOfDrinkCalls===0 && totalDrinkCount===0){
        displayErrorMessage('Invalid input! Try "Vodka, Tequila, Lime, Cola');
    }
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

//------------------------------ absolut ------------------------------//
//-----ajax call error-----//
/***************************************************************************************************
 * errorMessage
 * @params {data object}
 * @returns  {undefined}
 * searches absolut data base and receives list of drinks containing ingredient user searched for
 */
function errorMessageAbsolut(data) {
    console.log('server response error');
    $('#error-modal').modal('show');
    console.log(data);
    if (data.status === 404) {
        displayErrorMessage('Invalid Absolut Ajax URL');
    } else if (data.status === 0) {
        displayErrorMessage('Invalid data type');
    }
}
/***************************************************************************************************
 * errorMessageAbsolutData
 * @params {data object}
 * @returns  {undefined}
 * searches absolut data base and receives list of drinks containing ingredient user searched for
 */
function errorMessageAbsolutData(data) {
    console.log('server response error');
    console.log(data);
    if (data.status === 404) {
        displayErrorMessage('Invalid AbsolutDB Ajax URL');
    } else if (data.status === 0) {
        displayErrorMessage('Invalid AbsolutDB Ajax data type');
    }
}
//-----getting drinks-----//
/***************************************************************************************************
 * getDrinkList
 * @params {undefined}
 * @returns  {undefined}
 * searches absolut drink data base and receives list of drinks containing ingredient user searched for
 */
function getDrinkList() {
    $('.drink-list li').remove();
    var inputText = $('.input-drink').val();
    if (inputText.indexOf(' ') !== -1) {
        var space = inputText.indexOf(' ');
        var temp1 = inputText.charAt(space);
        console.log('space found at index of: ', space);
        var validInput = inputText.replace(temp1, '-');
        console.log(validInput);
    } else {
        validInput = inputText;
    }
    if (inputText === 'vodka' || inputText === 'Vodka') {
        validInput = 'absolut-vodka'
    }
    $.ajax({
        dataType: 'JSONP',
        url: 'https://addb.absolutdrinks.com//drinks/with/' + validInput + '/?apiKey=7ff28e17f19747118ccca524e1866701',
        method: 'get',
        success: function(data) {
            totalDrinkDataCheck(data.result.length);
            if (data.result.length !== 0) {
                for (var i = 0; i < data.result.length; i++) {
                    var drinkList = data.result[i].id;
                    renderDrink(drinkList);
                }
                console.log('server response: ', data.result);
            }
        },
        error: function(data) {
            errorMessageAbsolut(data);
        }
    })
}
/***************************************************************************************************
 * renderDrink
 * @params {drink data array}
 * @returns  {undefined}
 * loops through drink list and appends to page
 */
function renderDrink(drinkListDB) {
    $('.drink-list').show();
    var drinkList = $('<li>', {
        text: drinkListDB,
        css: {
            'text-decoration': 'underline',
            cursor: 'pointer'
        }
    }).click(getDataDrink);
    $('.drink-list > ul').append(drinkList);
}
/***************************************************************************************************
 * getDataDrink
 * @params {undefined}
 * @returns  {undefined}
 * after user picks drink from list, gets data from absolut server about selected drink and prepares for render
 */
function getDataDrink() {
    $('.ingred-list li').remove();
    var validInput = $(this).text();
    console.log('absolut server called');
    $.ajax({
        dataType: 'JSONP',
        url: 'https://addb.absolutdrinks.com/drinks/' + validInput + '?apiKey=7ff28e17f19747118ccca524e1866701',
        method: 'get',
        success: function(data) {
            var passData = [];
            var drink = data.result[0];
            console.log('server response: ', drink);
            var ingred = [];
            for (var i = 0; i < drink.ingredients.length; i++) {
                ingred.push(drink.ingredients[i].textPlain);
            }
            var desc = drink.descriptionPlain;
            var name = drink.name;
            var drinkId = drink.id;
            var skillLvl = drink.skill.name;
            var story = drink.story;
            var imgUrl = 'http://assets.absolutdrinks.com/drinks/solid-background-white/soft-shadow/floor-reflection/' + drinkId + '.png';
            passData.push(ingred, desc, name, skillLvl, story, imgUrl);
            console.log(passData);
            renderDrinkInfo(passData);
        },
        error: function(data) {
            errorMessageAbsolutData(data);
        }
    })
}
/***************************************************************************************************
 * renderDrinkInfo
 * @params {drink data array}
 * @returns  {undefined}
 * after drink is selected and info is passed along, renders drink info in appropriate divs
 */
function renderDrinkInfo(array) {
    $('.drink-list').css('display', 'none');
    $('.drink-ing').show();
    $('.photo-img').css('background-image', 'url(' + array[5] + ')');
    if (typeof(array[0]) === 'object') {
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
    $('.skill-sec p').text(array[3]);
    if (array[4] === '') {
        $('.story-sec p').text('No background story available');
    } else {
        $('.story-sec p').text(array[4]);
    }
}

//------------------------------ cocktailDB ------------------------------//
//-----ajax call error-----//
/***************************************************************************************************
 * errorMessageCocktail
 * @params {data object}
 * @returns  {undefined}
 * searches absolut data base and receives list of drinks containing ingredient user searched for
 */
function errorMessageCocktail(data) {
    console.log('server response error');
    console.log(data);
    if (data.status === 200) {
        displayErrorMessage('Invalid data type or URL');
    } else if (data.status === 0) {
        displayErrorMessage('Invalid CocktailDB Ajax method');
    }
}
/***************************************************************************************************
 * errorMessageCocktailData
 * @params {data object}
 * @returns  {undefined}
 * searches absolut data base and receives list of drinks containing ingredient user searched for
 */
function errorMessageCocktailData(data) {
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
 * searchCocktailDB
 * @params {undefined}
 * @returns  {undefined}
 * searches cocktail data base and receives list of drinks containing ingredient user searched for
 */
function searchCocktailDB() {
    var inputText = $('.input-drink').val();
    $.ajax({
        dataType: 'text',
        url: 'http://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + inputText,
        method: 'get',
        success: function(data) {
            try{
                data = JSON.parse(data);
            } catch(error){
                totalDrinkDataCheck(0);
                return;
            }
            totalDrinkDataCheck(data.drinks.length);
            if (data.drinks.length !== 0) {
                for (var i = 0; i < data.drinks.length; i++) {
                    var drinkList = data.drinks[i].strDrink;
                    renderDrinkCocktail(drinkList);
                }
                console.log('server response: ', data.drinks);
            }
        },
        error: errorMessageCocktail
    })
}
/***************************************************************************************************
 * renderDrinkCocktail
 * @params {drink data array}
 * @returns  {undefined}
 * loops through drink list and appends to page for cocktailDB
 */
function renderDrinkCocktail(drinkListCtDB) {
    $('.drink-list').show();
    var drinkListCt = $('<li>', {
        text: drinkListCtDB,
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
            for (var item in drink){
                if (item.indexOf("Ingredient") !== -1){
                    if (drink[item].length > 2){
                        ingred.push(drink[item]);
                    }
                }
                if (item.indexOf("Measure") !== -1){
                    if (drink[item].length > 2) {
                        measurement.push(drink[item]);
                    }
                }
            }
            for (var i = 0; i < measurement.length; i++){
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
            errorMessageCocktailData(data);
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
    if (array[4] === undefined) {
        $('.skill-sec p').text('No data available');
    } else {
        $('.skill-sec p').text(array[4]);
    }
    if (array[5] === undefined) {
        $('.story-sec p').text('No data available');
    } else {
        $('.story-sec p').text(array[5]);
    }
}
