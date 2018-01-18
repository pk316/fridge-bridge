/***************************************************************************************************
 * initializeApp
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, */

$(document).ready(initializeApp)

function initializeApp() {
    addClickHandler();

}
/***************************************************************************************************
 * addClickHandlers
 * @params {undefined}
 * @returns  {undefined}
 *
 */
function addClickHandler() {
    $('#submit-food').click(function () {
        getRecipe();
    })
    $('#food-input').keydown(function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            console.log('enter was pressed');
            $('#submit-food').click();
        }
    });
    $('.back-food').click(backToListFood);
}
/***************************************************************************************************
 * backToListFood
 * @params {undefined}
 * @returns  {undefined}
 * after user clicks on drink name and data comes up, clicking back to list will move the page back to drink list
 */
function backToListFood() {
    $('.back-food').addClass('disabled');
    var recipe = $('.recipe');
    var recipeList = $('.recipe-list');
    if (recipe.css('display') !== 'none' && recipeList.css('display') === 'none') {
        $('.recipe').css('display', 'none');
        $('.recipe-list').show();
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
/***************************************************************************************************
 * getRecipe
 * @params {undefined}
 * @returns  {undefined}
 *
 */
function getRecipe() {
    console.log('submit clicked');
    var ingredient = {
        recipe: $('#food-input').val(),
    };
    console.log(ingredient);
    if (ingredient.recipe !== '') {
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
                    renderRecipe(recipeObj, i);
                }
            },
            error: function (err) {
                console.log('error', err);
            },
        })
    } else {
        displayErrorMessage('Please enter an ingredient before searching');
    }
}
/***************************************************************************************************
 * renderRecipe
 * @params {recipeObj}
 * @returns  {undefined}
 *
 */
function renderRecipe(recipeObj, i) {
    $('.recipeList').show();
    console.log('render');
    var recipeId = recipeObj.recipeName;
    if (i < 5) {
        var imageOfDish = $('<img>').attr('src', recipeObj.imageUrlsBySize["90"]).click(function () {
            getInstructionUrl(recipeObj);
        });
        var imageDiv = $('<div>', {
            css: {
                cursor: 'pointer'
            }
        }).append($(imageOfDish)).append($('<p>').text(recipeId + ' by ' + recipeObj.sourceDisplayName));
        $('.rL1').append(imageDiv);
    } else {
        var imageOfDish = $('<img>').attr('src', recipeObj.imageUrlsBySize["90"]).click(function () {
            getInstructionUrl(recipeObj);
        });
        var imageDiv = $('<div>', {
            css: {
                cursor: 'pointer'
            }
        }).append($(imageOfDish)).append($('<p>').text(recipeId + ' by ' + recipeObj.sourceDisplayName));
        $('.rL2').append(imageDiv);
    }
}
/***************************************************************************************************
 * ajax call to get recipe instructions using recipe id from getRecipe ajax call
 * @params {recipeObj}
 * @returns  {undefined}
 *
 */
function getInstructionUrl(recipeObj) {
    $.ajax({
        url: 'http://api.yummly.com/v1/api/recipe/' + recipeObj.id + '?_app_id=fffebcbc&_app_key=34aa6c71c566decd872142c93f381916',
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
function renderIngredients(recipeObj, recipeUrl) {
    $('.back-food').removeClass('disabled');
    $('.recipe').show();
    $('.recipe-list').hide();
    var title = $('<p>').text(recipeObj.recipeName + ' by ' + recipeObj.sourceDisplayName);
    $('.recipe h2').append(title);
    var imageOfDish = $('<img>').attr('src', recipeObj.imageUrlsBySize["90"]);
    var imageDiv = $('<div>').append($(imageOfDish));
    $('.recipe-photo').append(imageDiv);
    var instructions = $('<a>').attr({
        href: recipeUrl,
        target: '_blank'
    }).text(recipeUrl);
    $('.recipe .instructions').append(instructions);
    var ingredientList = $('<p>').text(recipeObj.ingredients);
    $('.recipe .food-ingredients').append(ingredientList);
}
