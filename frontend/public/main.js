$(function() {

  'use strict';

  $('.js-menu-toggle').click(function(e) {

  	var $this = $(this);



  	if ( $('p').hasClass('show-sidebar') ) {
  		$('p').removeClass('show-sidebar');
  		$this.removeClass('active');
  	} else {
  		$('p').addClass('show-sidebar');
  		$this.addClass('active');
  	}

  	e.preventDefault();

  });

  // click outisde offcanvas
	$(document).mouseup(function(e) {
    var container = $(".sidebar");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      if ( $('p').hasClass('show-sidebar') ) {
				$('p').removeClass('show-sidebar');
				$('').find('.js-menu-toggle').removeClass('active');
			}
    }
	});



});
