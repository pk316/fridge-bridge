/* information about jsdocs:
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
*
/**
 * Listen for the document to load and initialize the application
 */
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
    $('.submitDrink').click(searchDB);
    $('.inputDrink').keyup(function(event){
        if (event.keyCode === 13){
            console.log('enter was pressed');
            $('.submitDrink').click();
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
    $('.searchAgain').addClass('mouseHover').click(function() {
        $('.drinkList').css('display', 'none');
        $('.drinkIng div p').text('');
        $('.drinkIng').css('display', 'none');
        $('.inputDrink').val('');
    })
}
/***************************************************************************************************
 * backToResult
 * @params {undefined}
 * @returns  {undefined}
 * after user clicks on drink name and data comes up, clicking back to list will move the page back to drink list
 */
function backToResult() {
    var drinkIng = $('.drinkIng');
    var drinkList = $('.drinkList');
        $('.backToList').addClass('mouseHover').click(function() {
            if (drinkIng.css('display') !== 'none' && drinkList.css('display') === 'none') {
                $('.drinkIng').css('display', 'none');
                $('.drinkList').show();
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
    $('.drinkList').css('display', 'none');
    $('.drinkIng div p').text('');
    $('.drinkIng').css('display', 'none');
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
    $('#errorModal').modal('show');
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
    $('#errorModal').modal('show');
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
 * searches absolut data base and receives list of drinks containing ingredient user searched for
 */
function getDrinkList() {
    $('.drinkList li').remove();
    var inputText = $('.inputDrink').val();
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
    $('.drinkList').show();
    var drinkList = $('<li>', {
        text: drinkListDB,
        css: {
            'text-decoration': 'underline',
            cursor: 'pointer'
        }
    }).click(getDataDrink);
    $('.drinkList > ul').append(drinkList);
}
/***************************************************************************************************
 * getDataDrink
 * @params {undefined}
 * @returns  {undefined}
 * after user picks drink from list, gets data from absolut server about selected drink and prepares for render
 */
function getDataDrink() {
    $('.ingredList li').remove();
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
            var imgUrl = 'https://assets.absolutdrinks.com/drinks/solid-background-white/soft-shadow/floor-reflection/' + drinkId + '.png';
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
    $('.drinkList').css('display', 'none');
    $('.drinkIng').show();
    $('.photoImg').css('background-image', 'url(' + array[5] + ')');
    if (typeof(array[0]) === 'object') {
        var ingredients = array[0];
        for (var j = 0; j < ingredients.length; j++) {
            var ingredientList = $('<li>', {
                text: ingredients[j]
            });
            $('.ingredSec > ul').append(ingredientList);
        }
    }
    $('.descSec p').text(array[1]);
    $('.drinkIng > h2').text(array[2]);
    $('.skillSec p').text(array[3]);
    if (array[4] === '') {
        $('.storySec p').text('No data available');
    } else {
        $('.storySec p').text(array[4]);
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
    var inputText = $('.inputDrink').val();
    $.ajax({
        dataType: 'text',
        url: 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + inputText,
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
    $('.drinkList').show();
    var drinkListCt = $('<li>', {
        text: drinkListCtDB,
        css: {
            'text-decoration': 'underline',
            cursor: 'pointer'
        }
    }).click(getDataCocktail);
    $('.drinkList > ul').append(drinkListCt);
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
        url: 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + validInput,
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
    $('.drinkList').css('display', 'none');
    $('.drinkIng').show();
    $('.photoImg').css('background-image', 'url(' + array[3] + ')');
    if (typeof(array[0]) === 'object') {
        var ingredients = array[0];
        for (var j = 0; j < ingredients.length; j++) {
            var ingredientList = $('<li>', {
                text: ingredients[j]
            });
            $('.ingredSec > ul').append(ingredientList);
        }
    }
    $('.descSec p').text(array[1]);
    $('.drinkIng > h2').text(array[2]);
    if (array[4] === undefined) {
        $('.skillSec p').text('No data available');
    } else {
        $('.skillSec p').text(array[4]);
    }
    if (array[5] === undefined) {
        $('.storySec p').text('No data available');
    } else {
        $('.storySec p').text(array[5]);
    }
}
