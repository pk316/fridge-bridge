/***************************************************************************************************
 * initializeApp
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, */

$(document).ready(initializeApp)

function initializeApp(){
    addClickHandler()
}
/***************************************************************************************************
 * addClickHandlers
 * @params {undefined}
 * @returns  {undefined}
 *
 */
function addClickHandler(){
    $('.button').click(function () {
        getRecipe();
    })
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
        recipe: $('.input').val(),
    };
    $.ajax({
        dataType: 'JSON',
        url: 'http://api.yummly.com/v1/api/recipes?',
        method: 'GET',
        data: {
            '_app_id': 'd3634cd9',
            '_app_key': '8445c9ed2464bb55e4842a2fb8ef2b9a',
            'q': ingredient.recipe,
        },
        success: function (result) {
            var resultObj ={};
            var imageArray = [];
            var recipeUrlArray = [];
            var displayNameArray = [];
            var ingredientsArray = [];
            var counter = result.matches.length
            console.log(result.matches);
            for (var i = 0; i < result.matches.length; i++) {
                var recipeObj = result.matches;
                var recipeImage = recipeObj[i].imageUrlsBySize['90'];
                var displayName = recipeObj[i].sourceDisplayName;
                var recipeId = recipeObj[i].id;
                var ingredients = recipeObj[i].ingredients;
                imageArray.push(recipeImage);
                ingredientsArray.push(ingredients);
                displayNameArray.push(displayName);
                console.log(ingredients);

                $.ajax({
                    url: 'http://api.yummly.com/v1/api/recipe/' + recipeId + '?_app_id=fffebcbc&_app_key=34aa6c71c566decd872142c93f381916',
                    dataType: 'JSON',
                    method: 'GET',
                    success: function (data) {
                        console.log('second ajax', data.source);
                        var recipeUrl = data.source.sourceRecipeUrl;
                        recipeUrlArray.push(recipeUrl);
                        counter--;
                        if (counter === 0 ){
                            allCallsDone(resultObj, imageArray, recipeUrl, displayNameArray, ingredientsArray)
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
 * allCallsDone - call Ajax calls are complete
 * @params {imageArray, recipeUrlArray, displayName}
 * @returns  {undefined}
 *
 */
function allCallsDone(resultObj, imageArray, recipeUrlArray, displayNameArray,ingredientsArray){
    resultObj.images = imageArray;
    resultObj.links = recipeUrlArray;
    resultObj.names = displayNameArray;
    resultObj.ingredients= ingredientsArray;
    console.log('all calls have completed');
    renderImage(resultObj);
}
/***************************************************************************************************
 * renderImage
 * @params {imageArray, recipeUrlArray, displayName}
 * @returns  {undefined}
 *
 */
function renderImage(resultObj) {
    console.log('render');
    for (var i = 0; i < resultObj.images.length; i++) {
        var imageLink = $('<a>').attr('href', resultObj.links[i]);
        var imageOfDish = $('<img>').attr('src', resultObj.images[i]);
        // var ingredients = $('<p>').text(resultObj.ingredients[i]);
        var imageDiv = $('<div>').append($(imageLink).prepend(imageOfDish)).append($('<p>').text(resultObj.names[i] + ' - ' + (resultObj.ingredients[i])));
        $('.recipeArea').append(imageDiv);

    }


}