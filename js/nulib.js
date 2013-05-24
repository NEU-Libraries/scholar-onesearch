$(function() {
  //$('#contentEXL').addClass('container'); 
  $('meta[name="viewport"]').attr('content','width=device-width, initial-scale=1.0');
  $('#search_field').attr('placeholder','Search...');
  //Adding icons for the next arrows
  $('a.EXLBriefResultsPaginationLinkNext > img').after('<i class="icon-circle-arrow-right"></i>');
  $('a.EXLBriefResultsPaginationLinkPrevious:first-of-type > img').after('<i class="icon-circle-arrow-left"></i>');
  //just adding a special character to the submit button;
  $('#goButton').val("➜");
  $('form[name="rssForm"]').prepend('<i class="icon-rss"></i>');
  $('img[alt="Add to e-Shelf"]').after('<i class="icon-bookmark-empty icon-large"></i>').hide();
  $('img[alt="In e-Shelf"]').after('<i class="icon-bookmark icon-large"></i>').hide();
  $('td.EXLMyShelfStar > a').click(function(){
    var $i  = $(this).children("i");
    if ($i.hasClass('icon-bookmark-empty')){
      $i.removeClass('icon-bookmark-empty').addClass('icon-bookmark');
    }
    else{
      $i.removeClass('icon-bookmark').addClass('icon-bookmark-empty');
    }
  });

});