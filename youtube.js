$(document).ready(initializeApp);
/***************************************************************************************************
 * initializeApp
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, adds click handlers to submit buttons
 */
function initializeApp() {
    $('.submitDrink, .submitFood').click(add_vids_to_carousel);
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
        $('.drinksSearchTerm').text("'" + drinkSearchTerm + "'");
        console.log(drinkSearchTerm);
        var drinkDataObject = {
            q: drinkSearchTerm + ' alcohol drink recipe tutorial',
            maxResults: 5
        };
        $.ajax({
            dataType: 'json',
            method: 'post',
            url: 'https://s-apis.learningfuze.com/hackathon/youtube/search.php',
            data: drinkDataObject,
            success: function (result) {
                console.log('ajax call success');
                for (var i = 0; i < result.video.length; i++) {
                    console.log(result.video[i].id);
                    $("#drinks_carousel").removeClass('hidden');
                    var videosList = $("<iframe>", {
                        width: '90%',
                        height: 315,
                        src: 'https://www.youtube.com/embed/' + result.video[i].id
                    });
                    $('#drinks_video' + i).append(videosList);
                }
            }
        });
    } else if ($(this).attr('id') === 'submitFood') {
        $(".foodItem").empty();
        var foodSearchTerm = $('#foodInput').val() + '';
        $('.foodSearchTerm').text("'" + foodSearchTerm + "'");
        console.log(foodSearchTerm);
        var foodDataObject = {
            q: foodSearchTerm + ' meals recipe tutorial',
            maxResults: 5
        };
        $.ajax({
            dataType: 'json',
            method: 'post',
            url: 'https://s-apis.learningfuze.com/hackathon/youtube/search.php',
            data: foodDataObject,
            success: function (result) {
                console.log('ajax call success');
                for (var i = 0; i < result.video.length; i++) {
                    console.log(result.video[i].id);
                    $("#food_carousel").removeClass('hidden');
                    var videosList = $("<iframe>", {
                        width: '90%',
                        height: 315,
                        src: 'https://www.youtube.com/embed/' + result.video[i].id
                    });
                    $('#food_video' + i).append(videosList);
                }
            }
        });
    }
}