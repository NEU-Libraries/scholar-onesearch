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
  $('td.EXLMyShelfStar > a').addClass('btn btn-success btn-small').click(function(){
    if ($(this).data('original-title') == "In e-Shelf"){
        $(this).tooltip('destroy').attr('title','Add to e-Shelf').tooltip({title:'Add to e-Shelf'});
    }
    else{
      $(this).tooltip('destroy').attr('title',"In e-Shelf").tooltip({title:'In e-Shelf'});
    }
    var $i  = $(this).children("i");
    if ($i.hasClass('icon-bookmark-empty')){
      $i.removeClass('icon-bookmark-empty').addClass('icon-bookmark');
    }
    else{
      $i.removeClass('icon-bookmark').addClass('icon-bookmark-empty');
    }
  }).tooltip();
  //tooltips for more of the UI
  $("a#showMoreOptions, a.EXLSearchFieldRibbonAdvancedTwoLinks").tooltip();
});