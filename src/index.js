$(document).ready(function () {
    $('.filter-button').click(function () {
        var value = $(this).attr('data-filter');

        if (value == 'all') {
            $('.filter').show('10');
        } else {
            $('.filter')
                .not('.' + value)
                .hide('10'); // 3000
            $('.filter')
                .filter('.' + value)
                .show('10');
        }
    });

    if ($('.filter-button').removeClass('active')) {
        $(this).removeClass('active');
    }
    $(this).addClass('active');
});
