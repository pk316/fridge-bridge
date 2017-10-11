/* information about jsdocs:
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
*
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);
/**
 * Define all global variables here.
 */
/***************************************************************************************************
 * initializeApp
 * @params {undefined}
 * @returns: {undefined}
 * initializes the application, adding click handlers
 */
function initializeApp() {
    addClickHandlers();
}
/***************************************************************************************************
 * addClickHandlers
 * @params {undefined}
 * @returns  {undefined}
 * adds click handlers to page when initializeApp is called on document.ready
 */
function addClickHandlers() {
    $('.submitDrink').click(getDrinkList).click(searchCocktailDB);
}
/***************************************************************************************************
 * getDrinkList
 * @params {undefined}
 * @returns  {undefined}
 * gives back list of drinks when user clicks submit after valid input
 */
function getDrinkList() {
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

    $.ajax({
        dataType: 'JSONP',
        url: 'https://addb.absolutdrinks.com//drinks/with/' + validInput + '/?apiKey=7ff28e17f19747118ccca524e1866701',
        method: 'get',
        success: function(data) {
            for (var i = 0; i < data.result.length; i++) {
                var drinkList = data.result[i].id;
                renderDrink(drinkList)
            }
            console.log('server response: ', data.result);
        }
    })
}

function getDataDrink() {
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
            var imgUrl = 'http://assets.absolutdrinks.com/drinks/transparent-background-white/' + drinkId + '.png';
            passData.push(ingred, desc, name, skillLvl, story, imgUrl);
            console.log(passData);
            renderDrinkInfo(passData);
        }
    })
}

//--------------Cocktail DB--------------//
function searchCocktailDB() {
    var inputText = $('.inputDrink').val();

    $.ajax({
        dataType: 'JSON',
        url: 'http://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + inputText,
        method: 'get',
        success: function(data) {
            for (var i = 0; i < data.drinks.length; i++) {
                var drinkList = data.drinks[i].strDrink;
                renderDrinkCocktail(drinkList)
            }
            console.log('server response: ', data.drinks);
        }
    })
}

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
            for (var i = 0; i < ingred.length; i++){
                var amount = ' ' + measurement[i];
                ingred[i] += amount;
            }
            // for (var i = drink.strIngredient1; i < drink.strIngredient15; i++) {
            //     ingred.push(drink.strIngredient[i]);
            // }
            var desc = drink.strInstructions;
            var name = drink.strDrink;
            var imgUrl = drink.strDrinkThumb;
            passData.push(ingred, desc, name, imgUrl);
            console.log(passData);
            renderCocktailInfo(passData);
        }
    })
}
/***************************************************************************************************
 * renderDrink
 * @params {ingredients}
 * @returns  {undefined}
 * loops through ingredient list and appends to page
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

function renderDrinkInfo(array) {
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
    if (array[4] === undefined) {
        $('.storySec p').text('No data available');
    } else {
        $('.storySec p').text(array[4]);
    }
}

//--------------Cocktail DB--------------//
function renderDrinkCocktail(drinkListCtDB) {
    var drinkListCt = $('<li>', {
        text: drinkListCtDB,
        css: {
            'text-decoration': 'underline',
            cursor: 'pointer'
        }
    }).click(getDataCocktail);
    $('.drinkList > ul').append(drinkListCt);
}

function renderCocktailInfo(array) {
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
