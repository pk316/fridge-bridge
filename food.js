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
            var imageArray = [];
            var recipeUrlArray = [];
            var counter = result.matches.length
            console.log(result.matches);
            for (var i = 0; i < result.matches.length; i++) {
                var recipeObj = result.matches;
                var recipeImage = recipeObj[i].imageUrlsBySize['90'];
                imageArray.push(recipeImage);
                var recipeId = recipeObj[i].id;
                var ingredients = recipeObj[i].ingredients;
                var displayName = recipeObj[i].sourceDisplayName;
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
                            allCallsDone(imageArray, recipeUrl, displayName)
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
function allCallsDone(imageArray, recipeUrlArray, displayName){
    console.log('all calls have completed');
    renderImage(imageArray, recipeUrlArray, displayName);
}
/***************************************************************************************************
 * renderImage
 * @params {imageArray, recipeUrlArray, displayName}
 * @returns  {undefined}
 *
 */
function renderImage(imageArray, recipeUrlArray, displayName){
    console.log('render');
    for (var i = 0 ; i < imageArray.length ; i++){
        var imageDiv = $('<div>').prepend($('<p>').append($('<img>').attr('src',imageArray[i])));
        $('#main').prepend(imageDiv);
    }
}



// var imgElement = $('<img>').attr('src',recipeImage);
// var imageDiv = $('<div>').append(displayName).prepend(imgElement);
// $('#main').append(imageDiv);

//
// function getDirections(recipeId){
//     var recipeUrlArray =[];
//
//     $.ajax({
//         url: 'http://api.yummly.com/v1/api/recipe/'+recipeId+'?_app_id=fffebcbc&_app_key=34aa6c71c566decd872142c93f381916',
//         dataType: 'JSON',
//         method: 'GET',
//         success: function (data) {
//             console.log('second ajax' , data.source);
//             var recipeUrl = data.source.sourceRecipeUrl;
//             recipeUrlArray.push(recipeUrl);
//
//
//
//
//             // var linkToRecipe = $('<a>').attr('href', recipeUrl).text(recipeId);
//             // $('#main').append(linkToRecipe);
//         }
//     });


