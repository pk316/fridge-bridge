// $(document).ready(function() {
//     console.log('this function is running');
//     $('#slide').click(function() {
//         var test = $('#slide-body');
//         if ($(test).hasClass('expanded')) {
//             $(test).removeClass('expanded');
//             $('#more').text('more...');
//         } else {
//             $(test).addClass('expanded');
//             $('#more').text('less...');
//         }
//     })
// })

$(document).ready(function() {
    console.log('expanding drink list function');
    $('#expand-drink-list').click(function() {
        console.log('clickclick');
        var test = $('#expand-drink-list-body');
        if ($(test).hasClass('expanded')) {
            $(test).removeClass('expanded');
            $('#more').text('more...');
        } else {
            $(test).addClass('expanded');
            $('#more').text('less...');
        }
    })
})