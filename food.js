/***************************************************************************************************
 * initializeApp
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, */

$(document).ready(initializeApp);

function initializeApp(){
    addClickHandler();
}
/***************************************************************************************************
 * Global Variables
 */
var counter = 0;
/***************************************************************************************************
 * addClickHandlers
 * @params {undefined}
 * @returns  {undefined}
 *
 */
function addClickHandler(){
    $('#submitFood').click(function () {
        getRecipe();
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
function searchAgain(){
    $('.searchAgain').click(function() {
        console.log('search again clicked');
        $('.recipeList .recipe').css('display', 'none');
        $('.recipe').text('');
        $('#foodInput').val('');
    });
}
/***************************************************************************************************
 * backToResult
 * @params {undefined}
 * @returns  {undefined}
 *
 */
function backToResult() {
    $('.backToList').click(function() {
        console.log('back to results clicked');
        var recipe = $('.recipe');
        var recipeList = $('.recipeList');
        if (recipe.css('display') !== 'none' && recipeList.css('display') === 'none') {
            $('.recipe').css('display', 'none');
            $('.recipeList').show();
        }
    });
}
/***************************************************************************************************
 * getRecipe
 * @params {undefined}
 * @returns  {undefined}
 *
 */
function getRecipe() {
    console.log('submit clicked');
    var ingredient = {
        recipe: $('#foodInput').val(),
    };
    console.log(ingredient);
    $.ajax({
        dataType: 'JSON',
        url: 'https://api.yummly.com/v1/api/recipes?',
        method: 'GET',
        data: {
            '_app_id': 'd3634cd9',
            '_app_key': '8445c9ed2464bb55e4842a2fb8ef2b9a',
            'q': ingredient.recipe,
        },
        success: function (result) {
            var recipeObj = {};

            console.log(result.matches);
            for (var i = 0; i < result.matches.length; i++) {

                recipeObj = result.matches[i];
                renderRecipe(recipeObj);
            }
        },
        error: function (err) {
            console.log('error', err);
        },
    })
}
/***************************************************************************************************
 * renderRecipe
 * @params {recipeObj}
 * @returns  {undefined}
 *
 */
function renderRecipe(recipeObj){
    $('.recipeList').show();
    console.log('render');
    var recipeArrayItem = recipeObj.id.split('-');
    var recipeArray = recipeArrayItem.splice(0,recipeArrayItem.length-1);
    var recipeId = recipeArray.join(' ');

    if ( counter  < 5){
        var imageOfDish = $('<img>').attr('src',recipeObj.imageUrlsBySize["90"]).click(function(){
            getInstructionUrl(recipeObj);
        });
        var imageDiv = $('<div>').append($(imageOfDish)).append($('<p>').text(recipeId + ' by ' + recipeObj.sourceDisplayName));
        $('.rL1').append(imageDiv);
    } else{
        var imageOfDish = $('<img>').attr('src',recipeObj.imageUrlsBySize["90"]).click(function(){
            getInstructionUrl(recipeObj);
        });
        var imageDiv = $('<div>').append($(imageOfDish)).append($('<p>').text(recipeId + ' by ' + recipeObj.sourceDisplayName));
        $('.rL2').append(imageDiv);
    }
    counter++;
}
/***************************************************************************************************
 * ajax call to get recipe instructions using recipe id from getRecipe ajax call
 * @params {recipeObj}
 * @returns  {undefined}
 *
 */
function getInstructionUrl(recipeObj){
    $.ajax({
        url: 'http://api.yummly.com/v1/api/recipe/' + recipeObj.id+ '?_app_id=fffebcbc&_app_key=34aa6c71c566decd872142c93f381916',
        dataType: 'JSON',
        method: 'GET',
        success: function (data) {
            console.log('second ajax', data.source);
            var recipeUrl = data.source.sourceRecipeUrl;
            renderIngredients(recipeObj, recipeUrl);
        }
    })
}
/***************************************************************************************************
 * renderIngredients
 * @params {recipeObj, recipeUrl}
 * @returns  {undefined}
 *
 */
function renderIngredients( recipeObj, recipeUrl) {
    $('.recipe').show();
    $('.recipeList').css('display','none');
    var recipeArrayItem = recipeObj.id.split('-');
    var recipeArray = recipeArrayItem.splice(0,recipeArrayItem.length-1);
    var recipeId = recipeArray.join(' ');

    var title = $('<p>').text(recipeId+ ' by ' + recipeObj.sourceDisplayName);
    $('.recipe h2').append(title);

    var imageOfDish = $('<img>').attr('src',recipeObj.imageUrlsBySize["90"]);
    var imageDiv = $('<div>').append($(imageOfDish));
    $('.recipePhoto').append(imageDiv);

    var instructions = $('<a>').attr('href',recipeUrl).text(recipeUrl);
    $('.recipe .instructions p').append(instructions);

    if (typeof(recipeObj) === 'object') {
        var ingredients = recipeObj.ingredients;
        for (var j = 0; j < ingredients.length; j++) {
            var ingredientList = $('<li>', {
                text: ingredients[j]
            });
            var listOfIngredients = $('.foodIngredients > ul').append(ingredientList);
        }
    }
    $('.recipe .foodIngredients').append(listOfIngredients);
}