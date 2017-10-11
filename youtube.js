$(document).ready(initializeApp);
/***************************************************************************************************
 * initializeApp
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, adds click handlers to submit button
 */
function initializeApp() {
    $('#drinksButton').click(add_vids_to_carousel);
}
/***************************************************************************************************
 DRINKS DIV
 * add_vids_to_carousel
 * @params {undefined} none
 * @returns  {undefined} none
 *
 */
function add_vids_to_carousel() {
    console.log('click initiated');
    $(".item").empty();
    var searchTerm = $('input').val() + '';
    console.log(searchTerm);
    var data_object = {
        q: searchTerm + ' drink recipe tutorial',
        maxResults: 5
    };
    $.ajax({
        dataType: 'json',
        method: 'post',
        url: 'http://s-apis.learningfuze.com/hackathon/youtube/search.php',
        data: data_object,
        success: function(result) {
            console.log('ajax call success');
            for (var i=0; i<result.video.length; i++) {
                console.log(result.video[i].id);
                $(".carousel_container").removeClass('hidden');
                var videosList = $("<iframe>",{
                    width: '85%',
                    height: 315,
                    src: 'https://www.youtube.com/embed/' + result.video[i].id
                });
                $('#video'+i).append(videosList);
            }
        }
    });
}