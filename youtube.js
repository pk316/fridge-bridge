$(document).ready(initializeApp);
/***************************************************************************************************
 * initializeApp
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, adds click handlers to submit button
 */
function initializeApp() {
    $('#drinksButton, #foodButton').click(add_vids_to_carousel);
    // $('.html5-video-container').click(stopScroll);
}
/***************************************************************************************************
 YOUTUBE VIDS TO CAROUSEL
 * add_vids_to_carousel
 * @params {undefined} none
 * @returns  {undefined} none
 *
 */
function add_vids_to_carousel() {
    console.log('click initiated');
    if ($(this).attr('id') === 'drinksButton') {
        $(".drinksItem").empty();
        var drinkSearchTerm = $('#drinkInput').val() + '';
        console.log(drinkSearchTerm);
        var drinkDataObject = {
            q: drinkSearchTerm + ' drink recipe tutorial',
            maxResults: 5
        };
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
                        width: '85%',
                        height: 315,
                        src: 'https://www.youtube.com/embed/' + result.video[i].id
                    });
                    $('#drinksVideo' + i).append(videosList);
                }
            }
        });
    } else {
        $(".foodItem").empty();
        var foodSearchTerm = $('#foodInput').val() + '';
        console.log(foodSearchTerm);
        var foodDataObject = {
            q: foodSearchTerm + ' recipe tutorial',
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
                    $('#foodVideo' + i).append(videosList);
                }
            }
        });
    }
}

// function stopScroll() {
//     console.log('click enabled');
//     $('#youtube_carousel').attr('data-inverval', 'false');
// }

// on click, data-interval false
// on left & right, data-interval true