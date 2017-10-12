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
        recipe: $('.input').val()
    };
    $.ajax({
        dataType: 'JSON',
        url: 'http://api.yummly.com/v1/api/recipes?',
        method: 'GET',
        data: {
            '_app_id': 'd3634cd9',
            '_app_key': '8445c9ed2464bb55e4842a2fb8ef2b9a',
            'q': ingredient.recipe
        },
        success: function (result) {
            var recipeObj ={};
            var recipeUrlArray = [];
            var counter = result.matches.length
            console.log(result.matches);
            for (var i = 0; i < result.matches.length; i++) {
                recipeObj = result.matches;
                var recipeId = recipeObj[i].id;
                
                var ingredients = recipeObj[i].ingredients;

                var displayName = recipeObj[i].sourceDisplayName;


                var linkToRecipe = $('<button>').css({
                    'background-color':'red'
                });

                var image = $('<img>').attr('src', recipeImage);
                var div = $('<div>').append(image, displayName, linkToRecipe);
                $('.recipeArea').append(div);

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
                            allCallsDone(recipeObj)
                        }
                    }
                })
            }
        },
        error: function (err) {
            console.log('error', err);
        }
    })
}
/***************************************************************************************************
 * allCallsDone - call Ajax calls are complete
 * @params {resultObj}
 * @returns  {undefined}
 *
 */
function allCallsDone(recipeObj){

    console.log('all calls have completed');
    renderImage(recipeObj);
}
/***************************************************************************************************
 * renderImage
 * @params {resultObj}
 * @returns  {undefined}
 *
 */
function renderImage(recipeObj){
    console.log('render');
    for ( i in recipeObj){
            var recipeArrayItem = recipeObj[i].id.split('-');
            var recipeArray = recipeArrayItem.splice(0,recipeArrayItem.length-1);
            var recipeId = recipeArray.join(' ')
            var imageOfDish = $('<img>').attr('src',recipeObj[i].imageUrlsBySize["90"]);
            var imageDiv = $('<div>').append($(imageOfDish)).append($('<p>').text(recipeId + ' by ' + recipeObj[i].sourceDisplayName + ' - '+recipeObj[i].ingredients));
            $('.recipeArea').append(imageDiv);
    }

}
