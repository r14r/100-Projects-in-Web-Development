$(document).ready(function () {
	$('.filter-button').click(function () {
		var value = $(this).attr('data-filter');

		console.log('filter: value="' + value + '"');

		if (value == 'all') {
			$('.filter').show('10');
		} else {
			$('.filter')
				.not('.filter-' + value)
				.hide('10');
			$('.filter')
				.filter('.filter-' + value)
				.show('10');
		}
	});

	if ($('.filter-button').removeClass('active')) {
		$(this).removeClass('active');
	}
	$(this).addClass('active');
});

/*-------------------------------------------------------------------------------------------------
 *
 *
 *
 * <div class="middle"></div>
 *
 * $('div').css('background', '#c8ebcc').filter('.middle').css('border-color', 'red');
 */
