$(function() {
  //$('#contentEXL').addClass('container'); 
  $('meta[name="viewport"]').attr('content','width=device-width, initial-scale=1.0');
  $('#search_field').attr('placeholder','Search...');
  //Adding icons for the next arrows
  $('a.EXLBriefResultsPaginationLinkNext > img').after('<i class="icon-circle-arrow-right"></i>');
  $('a.EXLBriefResultsPaginationLinkPrevious:first-of-type > img').after('<i class="icon-circle-arrow-left"></i>');
  //just adding a special character to the submit button;
  $('#goButton').val("➜");
  

});