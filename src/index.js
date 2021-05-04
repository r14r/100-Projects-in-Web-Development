$(document).ready(function () {
    $('.card')
        .delay(1800)
        .queue(function (next) {
            $(this).removeClass('hover');
            $('a.hover').removeClass('hover');
            next();
        });

    $('.filter-button').click(function () {
        var value = $(this).attr('data-filter');

        console.log('filter: ' + value);

        if (value == 'all') {
            //$('.filter').removeClass('hidden');
            $('.filter').show('1000');
        } else {
            //            $('.filter[filter-item="'+value+'"]').removeClass('hidden');
            //            $(".filter").not('.filter[filter-item="'+value+'"]').addClass('hidden');
            $('.filter')
                .not('.' + value)
                .hide('3000');
            $('.filter')
                .filter('.' + value)
                .show('3000');
        }
    });

    if ($('.filter-button').removeClass('active')) {
        $(this).removeClass('active');
    }
    $(this).addClass('active');
});
