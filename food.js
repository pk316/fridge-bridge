/* information about jsdocs:
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
*
/**
 * Listen for the document to load and initialize the application
 */

$(document).ready(function() {
    $('.button').click(function () {
        getRecipe();
        // getDirections();
    })
})
/**
 * Define all global variables here.
 */

/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input:
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */
/***************************************************************************************************
 * initializeApp
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, including adding click handlers and pulling in any data from the server, in later versions
 */

/***************************************************************************************************
 * addClickHandlersToElements
 * @params {undefined}
 * @returns  {undefined}
 *
 */
// //
// // function getRecipe() {
// //     console.log('submit clicked');
// //     var ingredient = {
// //         recipe: $('.input').val(),
// //     };
// //     $.ajax({
// //         dataType: 'JSON',
// //         url: 'http://api.yummly.com/v1/api/recipes?',
// //         method: 'GET',
// //         data: {
// //             '_app_id': 'd3634cd9',
// //             '_app_key': '8445c9ed2464bb55e4842a2fb8ef2b9a',
// //             'q': ingredient.recipe,
// //         },
// //         success: function (result) {
// //             console.log(result.matches);
// //             for (var i = 0; i < result.matches.length; i++) {
// //                 console.log(result.matches[i].sourceDisplayName);
// //                 var recipeList = result.matches[i].sourceDisplayName;
// //                 var list = $('<ul>').append('<li>').append(recipeList);
// //                 $('#main').append(list);
// //             }
// //         },
// //         error: function (err) {
// //             console.log('error', err);
// //         },
// //     })
// // }
// //
// var recipeIdArray=[];

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
            console.log(result.matches);
            for (var i = 0; i < result.matches.length; i++) {
                var recipeObj = result.matches;
                var recipeImage = recipeObj[i].imageUrlsBySize['90'];
                var recipeId = recipeObj[i].id;
                var ingredients = recipeObj[i].ingredients;
                var displayName = recipeObj[i].sourceDisplayName;

                //
                // var position = recipeId.indexOf( '/' );
                // var name = recipeId.substring( position + 1 );
                // var imgpath = recipeId;
                // console.log(name)
                var linkToRecipe = $('<button>').css({
                    'background-color':'red'
                })

                var image = $('<img>').attr('src', recipeImage);
                var div = $('<div>').append(image, displayName, linkToRecipe);
                $('#main').append(div);
                // $('#main').append(image);

                // console.log(result.matches[i].imageUrlsBySize["90"]);
                // var recipeImage = result.matches[i].imageUrlsBySize["90"];
                // var image = $('<img>').attr('src', recipeImage);
                // $('#main').append(image);
                // console.log(result.matches[i].id);
                // var recipeId = result.matches[i].id;
                // var ingredients = result.matches[i].ingredients;
                console.log(ingredients);

                var recipeArray= [];
                $.ajax({
                    url: 'http://api.yummly.com/v1/api/recipe/'+recipeId+'?_app_id=fffebcbc&_app_key=34aa6c71c566decd872142c93f381916',
                    dataType: 'JSON',
                    method: 'GET',
                    success: function (data) {
                        console.log('second ajax' , data.source);
                            var recipeUrl = data.source.sourceRecipeUrl;
                            recipeArray.push(recipeUrl);


                        // var recipeUrl = data.source.sourceRecipeUrl;
                        // console.log(recipeUrl);
                        // var linkToRecipe = $('<a>').attr('href', recipeUrl).text(data.id);
                        // $('#main').append(linkToRecipe);
                    }
                })

            }
        },
        error: function (err) {
            console.log('error', err);
        },
    })
}
// function getDirections(){
//     for ( var i = 0; i <recipeIdArray.length; i++){
//         var recipeId = recipeIdArray[i];
//     $.ajax({
//         url: 'http://api.yummly.com/v1/api/recipe/'+recipeId+'?_app_id=fffebcbc&_app_key=34aa6c71c566decd872142c93f381916',
//         dataType: 'JSON',
//         method: 'GET',
//         success: function (data) {
//             console.log('second ajax' , data.source);
//             var recipeUrl = data.source.sourceRecipeUrl;
//             console.log(recipeUrl);
//             var linkToRecipe = $('<a>').attr('href', recipeUrl).text(recipeId);
//             $('#main').append(linkToRecipe);
//         }
//     })
//     }
// }

