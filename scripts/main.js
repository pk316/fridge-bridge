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

    //Prevent page from scrolling when hovering div
    // $('.drink-container, .food-container').on('DOMMouseScroll mousewheel', function(ev) {
    //     var $this = $(this),
    //         scrollTop = this.scrollTop,
    //         scrollHeight = this.scrollHeight,
    //         height = $this.height(),
    //         delta = (ev.type == 'DOMMouseScroll' ?
    //             ev.originalEvent.detail * -40 :
    //             ev.originalEvent.wheelDelta),
    //         up = delta > 0;
    
    //     var prevent = function() {
    //         ev.stopPropagation();
    //         ev.preventDefault();
    //         ev.returnValue = false;
    //         return false;
    //     }
    
    //     if (!up && -delta > scrollHeight - height - scrollTop) {
    //         // Scrolling down, but this will take us past the bottom.
    //         $this.scrollTop(scrollHeight);
    //         return prevent();
    //     } else if (up && delta > scrollTop) {
    //         // Scrolling up, but this will take us past the top.
    //         $this.scrollTop(0);
    //         return prevent();
    //     }
    // });
})

