$(function() {
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
  //replace the external link icon with icon-font
  $('img[src="../images/icon_popout_tab.png"]').hide().after('<i class="icon-external-link"></i>');
  
  // Adding the function to crate the popover for the sign in link.
  var signinPopover  = function(){
    if ( sessionStorage.getItem('popoverDissmiss') !== 'true'){
      $('ul.EXLEShelfTileGuest > li.EXLSignOut').popover({
      title: 'Yo! Sign in <button="#exlidSignOut" id="nulib-signin-popover" class="close pull-right" onclick="dismissSigninPopover()")">x</button>',
      content: '<p>you better sign in</p>',
      placement: 'bottom',
      // trigger: 'manual',
      html: true,
      }).popover('show');
    }
    else{
      return;
    } 
  }

  signinPopover();
});



var dismissSigninPopover = function(){
  $('ul.EXLEShelfTileGuest > li.EXLSignOut').popover('hide');
  sessionStorage.setItem('popoverDissmiss', 'true');
}