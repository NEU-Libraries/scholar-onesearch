$(function() {
  //Adding icons for the next arrows
  $('a.EXLBriefResultsPaginationLinkNext > img').after('<i class="icon-circle-arrow-right"></i>');
  $('a.EXLBriefResultsPaginationLinkPrevious:first-of-type > img').after('<i class="icon-circle-arrow-left"></i>');
  //just adding a special character to the submit button;
  $('#goButton').val("➜");
  //adding an icon before the RSS link;
  $('form[name="rssForm"]').prepend('<i class="icon-rss"></i>');
  $('.EXLFacetSaveSearchAction > a').before('<i class="icon-save"/>');
  $('.EXLFacetSaveToEShelfAction > a').before('<i class="icon-bookmark"/>');
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


  //Create the report a problem link on each of the results.
  var reportAProblem = function(){
    $results = $('#exlidResultsTable tr.EXLResult');
    $results.each(function(){
      var title = $(this).find('h2.EXLResultTitle').text().trim();
      var id = $(this).find('a.EXLResultRecordId').attr('id');
      //The Document ID
      var titleStr = title + ' (' + id + ')';
      
      var url = 'http://library.northeastern.edu/get-help/tech-support/report-a-problem?resource=' + encodeURIComponent(titleStr);

      var link = '<a class="report-a-problem pull-right btn btn-small btn-link" href="' + url + '" title="Report a problem." target="_blank"><i class="icon-warning-sign"></a>'
      $(this).find('ul.EXLResultTabs').append(link);
    });
    $('a.report-a-problem').tooltip();
  }

  reportAProblem();
  

  var buildNavBarNav = function(){
    $('#exlidMainMenuTile').hide();
    $('div.EXLSearchFieldRibbonBrowseSearchLink').after('<div class="EXLSearchFieldRibbonAtoZLink"/>');
    $('div.EXLSearchFieldRibbonAtoZLink').append($('a.EXLMainMenuITEMATOZ').addClass('EXLSearchFieldRibbonAdvancedTwoLinks'));
  }
  //move the a-to-z link item to the search bar.
  //buildNavBarNav();
  //
  var buildFacetCollapse = function(){
    var i = 1;
    $('li.EXLFacetsDisplayMore').hide();
    //Creating a collapse group.
    $('#facetList > .EXLFacetContainer').each(function(){
      
      var $link = $('<a href="#expandFacet'+ i +'"><i class="icon-expand-alt icon-large pull-right"></i></a>');
      $link.click(function(){
        console.lg
        $(this).parents('.EXLFacetContainer').find('li.EXLFacet').toggleClass('EXLAdditionalFacet');
        $(this).find('i').toggleClass('icon-expand-alt').toggleClass('icon-collapse-alt');
        //$(this).find('ol li').toggleClass('EXLAdditionalFacet');
      });
      $(this).find('h4').append($link);

      i++;
    });
  }
  buildFacetCollapse();
  
  


});



var dismissSigninPopover = function(){
  $('ul.EXLEShelfTileGuest > li.EXLSignOut').popover('hide');
  sessionStorage.setItem('popoverDissmiss', 'true');
}