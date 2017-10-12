/***************************************************************************************************
 * initializeApp
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, */

$(document).ready(initializeApp)

function initializeApp(){
    addClickHandler();

}
/***************************************************************************************************
 * addClickHandlers
 * @params {undefined}
 * @returns  {undefined}
 *
 */
function addClickHandler(){
    $('#submitFood').click(function () {
        getRecipe();
    })
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
    $('.searchAgain').click(function() {
        console.log('search again was pressed');
        $('.recipeList').css('display', 'none');
        $('.recipe div p').text('');
        $('.recipe').css('display', 'none');
        $('.inputFood').val('');
    });
}
/***************************************************************************************************
 * backToResult
 * @params {undefined}
 * @returns  {undefined}
 * after user clicks on drink name and data comes up, clicking back to list will move the page back to drink list
 */
function backToResult() {
    var recipe = $('.recipe');
    var recipeList = $('.recipeList');
    $('.backToList').click(function() {
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
            var recipeObj ={};
            var recipeUrlArray = [];
            var counter = result.matches.length
            console.log(result.matches);
            for (var i = 0; i < result.matches.length; i++) {
                recipeObj = result.matches;
                var recipeId = recipeObj[i].id;
                $.ajax({
                    url: 'https://api.yummly.com/v1/api/recipe/' + recipeId + '?_app_id=fffebcbc&_app_key=34aa6c71c566decd872142c93f381916',
                    dataType: 'JSON',
                    method: 'GET',
                    success: function (data) {
                        console.log('second ajax', data.source);
                        var recipeUrl = data.source.sourceRecipeUrl;
                        recipeUrlArray.push(recipeUrl);
                        counter--;
                        if (counter === 0 ){
                            allCallsDone(recipeObj, recipeUrlArray);
                        }
                    }
                })
            }
        },
        error: function (err) {
            console.log('error', err);
        },
    })
}
/***************************************************************************************************
 * allCallsDone - all Ajax calls are complete, call next function
 * @params {recipeObj, recipeUrlArray}
 * @returns  {undefined}
 *
 */
function allCallsDone(recipeObj, recipeUrlArray){
    console.log('all calls are complete');
    renderRecipe(recipeObj, recipeUrlArray);
}
/***************************************************************************************************
 * renderRecipe
 * @params {recipeObj, recipeUrlArray}
 * @returns  {undefined}
 *
 */
function renderRecipe(recipeObj, recipeUrlArray){
   var ingredientObj = {};
    $('.recipeList').show();
    console.log('render');
    for ( i in recipeObj){
            var recipeArrayItem = recipeObj[i].id.split('-');
            var recipeArray = recipeArrayItem.splice(0,recipeArrayItem.length-1);
            var recipeId = recipeArray.join(' ');
            var ingredients = recipeObj[i].ingredients;
            ingredientObj[i] = ingredients;
                if ( i < 5){
                    var imageOfDish = $('<img>').attr('src',recipeObj[i].imageUrlsBySize["90"]).click(function(){
                        renderIngredients(recipeObj, ingredientObj, recipeUrlArray);
                    });
                    var imageDiv = $('<div>').append($(imageOfDish)).append($('<p>').text(recipeId + ' by ' + recipeObj[i].sourceDisplayName));
                    $('.rL1').append(imageDiv);
                } else{
                    var imageOfDish = $('<img>').attr('src',recipeObj[i].imageUrlsBySize["90"]).click(function(){
                        renderIngredients(recipeObj, ingredientObj, recipeUrlArray);
                    });
                    var imageDiv = $('<div>').append($(imageOfDish)).append($('<p>').text(recipeId + ' by ' + recipeObj[i].sourceDisplayName));
                    $('.rL2').append(imageDiv);
                }
    }

}
/***************************************************************************************************
 * renderIngredients
 * @params {recipeObj, ingredientObj, recipeUrlArray}
 * @returns  {undefined}
 *
 */
function renderIngredients( recipeObj, ingredientObj, recipeUrlArray) {
    $('.recipe').show();
    $('.recipeList').hide();

    var recipeArrayItem = recipeObj[i].id.split('-');
    var recipeArray = recipeArrayItem.splice(0,recipeArrayItem.length-1);
    var recipeId = recipeArray.join(' ');

        var title = $('<p>').text(recipeId+ ' by ' + recipeObj[i].sourceDisplayName);
        $('.recipe h2').append(title);
        var imageOfDish = $('<img>').attr('src',recipeObj[i].imageUrlsBySize["90"]);
        var imageDiv = $('<div>').append($(imageOfDish));
        $('.recipePhoto').append(imageDiv);
        var instructions = $('<a>').attr('href',recipeUrlArray[i]).text(recipeUrlArray[i]);
        $('.recipe .instructions p').append(instructions);
        var ingredientList = $('<p>').text(ingredientObj[i]);
        $('.recipe .foodIngredients').append(ingredientList);
}