$(document).ready(initializeApp);
/***************************************************************************************************
 * initializeApp
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, adds click handlers to submit button
 */
function initializeApp() {
    $('.submitDrink, .submitFood').click(add_vids_to_carousel);
    // $('.html5-video-container').click(stopScroll);
}
/***************************************************************************************************
 * add_vids_to_carousel
 * @params {undefined} none
 * @returns  {undefined} none
 * when search is utilized, takes user's terms and uses youtube api to pull up related tutorials/recipes
 */
function add_vids_to_carousel() {
    console.log('click initiated');
    console.log(this);
    if ($(this).attr('id') === 'submitDrink') {
        $(".drinksItem").empty();
        var drinkSearchTerm = $('.inputDrink').val() + '';
        $('.searchTerm').text("'" + drinkSearchTerm + "'");
        console.log(drinkSearchTerm);
        var drinkDataObject = {
            q: drinkSearchTerm + ' alcohol drink recipe tutorial',
            maxResults: 5
        };
        // USING YOUTUBE API
        $.ajax({
            dataType: 'json',
            method: 'post',
            url: 'http://s-apis.learningfuze.com/hackathon/youtube/search.php',
            data: drinkDataObject,
            success: function (result) {
                console.log('ajax call success');
                for (var i = 0; i < result.video.length; i++) {
                    console.log(result.video[i].id);
                    $("#drinks_carousel").removeClass('hidden');
                    var videosList = $("<iframe>", {
                        width: '95%',
                        height: 315,
                        src: 'https://www.youtube.com/embed/' + result.video[i].id
                    });
                    $('#drinks_video' + i).append(videosList);
                }
            }
        });
        // USING ABSOLUT VID API
        // $.ajax({
        //     dataType: 'jsonp',
        //     method: 'get',
        //     url: 'https://addb.absolutdrinks.com/drinks/with/' + drinkSearchTerm + '?apiKey=7ff28e17f19747118ccca524e1866701',
        //     success: function (result) {
        //         console.log('ajax call success');
        //         for (var i=0; i<result.result.length; i++){
        //             $("#drinks_carousel").removeClass('hidden');
        //                 var videosList = $("<iframe>", {
        //                     width: '85%',
        //                     height: 315,
        //                     src: 'https://www.youtube.com/embed/' + result.result[0].videos[0].video
        //                 });
        //                 $('#drinks_video' + i).append(videosList);
        //         }
        //     }
        // });
    } else if ($(this).attr('id') === 'submitFood') {
        $(".foodItem").empty();
        var foodSearchTerm = $('#foodInput').val() + '';
        $('.searchTerm').text("'" + foodSearchTerm + "'");
        console.log(foodSearchTerm);
        var foodDataObject = {
            q: foodSearchTerm + ' meals recipe tutorial',
            maxResults: 5
        };
        $.ajax({
            dataType: 'json',
            method: 'post',
            url: 'http://s-apis.learningfuze.com/hackathon/youtube/search.php',
            data: foodDataObject,
            success: function (result) {
                console.log('ajax call success');
                for (var i = 0; i < result.video.length; i++) {
                    console.log(result.video[i].id);
                    $("#food_carousel").removeClass('hidden');
                    var videosList = $("<iframe>", {
                        width: '85%',
                        height: 315,
                        src: 'https://www.youtube.com/embed/' + result.video[i].id
                    });
                    $('#food_video' + i).append(videosList);
                }
            }
        });
    }
}

// function addYoutubeiFrame (carouselId, videoID) {
//
// }

// function stopScroll() {
//     console.log('click enabled');
//     $('#youtube_carousel').attr('data-inverval', 'false');
// }

// on click, data-interval false
// on left & right, data-interval true