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
function initializeApp() {
    $('button').click(generate_youtube_carousel);
}

/***************************************************************************************************
 * addClickHandlersToElements
 * @params {undefined}
 * @returns  {undefined}
 *
 */

/***************************************************************************************************
 * grab_food_recipes
 * @params {undefined}
 * @returns  {undefined}
 *
 */
// function grab_food_recipes() {
//     $('button').click(function(){
//        console.log('click initiated');
//         var data_object = {
//             _app_key: '34aa6c71c566decd872142c93f381916',
//             _app_id: 'fffebcbc',
//             q: user_search
//         };
//        $.ajax({
//            dataType: 'json',
//            method: 'get',
//            url: 'http://api.yummly.com/v1/api/recipes?_app_id=app-id&_app_key=app-key&your_search_parameters',
//            data: data_object,
//            success: function(food) {
//                 $('.food-container').append(food);
//            }
//        })
//     });
// }

function generate_youtube_carousel() {
    console.log('click initiated');
    var searchTerm = $('input').val() + '';
    console.log(searchTerm);
    var data_object = {
        q: searchTerm + ' drink tutorial',
        maxResults: 3
    };
    $.ajax({
        dataType: 'json',
        method: 'post',
        url: 'http://s-apis.learningfuze.com/hackathon/youtube/search.php',
        data: data_object,
        success: function(result) {
            console.log('success' + result);
            for (var i=0; i<result.video.length; i++) {
                console.log(result.video[i].id);
                var videosList = $("<iframe>",{
                    width: '100%',
                    height: 315,
                    src: 'https://www.youtube.com/embed/' + result.video[i].id
                });
                $('#video'+i).append(videosList);
            }
        }
    });
}

//FOOD2FORK
// function grab_food_recipes() {
//     console.log('click initiated');
//     var ingredient = $('input').val();
//     console.log(ingredient);
//     var data_object = {
//         key: '06d052782502b53efbf89a55e1c65d15',
//         q: ingredient
//     };
//     $.ajax({
//         dataType: 'json',
//         method: 'get',
//         url: 'http://food2fork.com/api/search',
//         data: data_object,
//         success: function (food) {
//             console.log('success' + food);
//             // for (var i = 0; i < food.matches.length; i++) {
//             //     console.log(food.matches[i]);
//             //     var ingredients = $("<p>"), {
//             //         html: food
//             // .
//             //     matches[i]
//             // }
//             //     $('.food-container').append(ingredients);
//             // }
//         }
//     });
// }