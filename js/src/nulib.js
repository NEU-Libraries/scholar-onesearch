$( document ).ready(function() {
  var scholarOneSearch = (function(){
    'use strict';
    /**
     * Finds the URL path of the assets by finding the source of this script script#sos-app-js
     * @return {string} asset path
     */
    var assettUrl = function(){
      var url = $('script#sos-app-js').attr('src').toString();
      url = url.slice(0, url.search('js/'));
      return url;
    };

    //build report a problem links;
    var reportAProblem = function(){
      var $results = $('#exlidResultsTable tr.EXLResult');
      $results.each(function(){
        var title = $(this).find('h2.EXLResultTitle').text().trim();
        var id = $(this).find('a.EXLResultRecordId').attr('id');
        //The Document ID
        var titleStr = title + ' (' + id + ')';

        var url = 'http://library.northeastern.edu/get-help/tech-support/report-a-problem?resource=' + encodeURIComponent(titleStr);

        var $link = $('<li><a class="report-a-problem  btn btn-small btn-link" href="' + url + '" title="Report a problem." target="_blank"><i class="icon-comments-alt"></a><li>');
        $(this).find('ul.EXLResultTabs').append($link);
      });
      $('a.report-a-problem').tooltip();
    };

    //move the a-to-z link item to the search bar.
    //buildNavBarNav();
    //
    var buildFacetCollapse = function(){
      var i = 1;

      //Creating a collapse group.
      $('#facetList > .EXLFacetContainer').each(function(i){
        //find out if we should add the collapse
        var hasAdditionalFacetes = $(this).find('ol.EXLFacetsList > li').hasClass('EXLAdditionalFacet');

        if( i > 0 && hasAdditionalFacetes ){
            //refactor this code to to wrap the li item instead>
            $(this).find('li.EXLFacetsDisplayMore').addClass('EXLAdditionalFacet');
            var $target = $(this).find('h4');
            var $link = $('<a href="#expandFacet'+ (i + 1) +'" title="Expand ' + $target.text() +' list" class="facet-heading facet-expand"/>');
            var $icon = $('<i class="icon-expand-alt icon-large pull-right"/>');
            $link.click(function(){
              $(this).parents('.EXLFacetContainer').find('li.EXLFacet, li.EXLFacetsDisplayMore').toggleClass('EXLAdditionalFacet');
              $(this).find('i').toggleClass('icon-expand-alt').toggleClass('icon-collapse-alt');
              $(this).toggleClass('collapsed-facet');
                if( $(this).hasClass('collapsed-facet')){
                  $(this).tooltip('destroy').attr('title',  'Collapse '+ $target.text() +' list' ).tooltip();
                }
                else{
                  $(this).tooltip('destroy').attr('title',  'Expand '+ $target.text() +' list' ).tooltip();
                }

            });

            $target.addClass("list-group-item-heading").wrap($link).append($icon);
            $(this).find('a.facet-heading.facet-expand').wrap('<li class="EXLFacetHeader"/>').tooltip();
            $(this).find('ol.EXLFacetsList').prepend($(this).find('li.list-group-item'));
        }
      });

      $('li.EXLFacetsDisplayMore').find('a').html('Show more options<i class="icon-gear icon-large pull-right"/>').attr({
          title: "Refine your search more."
      }).tooltip();
    };

    var  eShelfIcons = function(){
      $('img[alt="Add to e-Shelf"]').after('<i class="icon-bookmark-empty icon-large"></i>').hide();
      $('img[alt="In e-Shelf"]').after('<i class="icon-bookmark icon-large"></i>').hide();
      $('td.EXLMyShelfStar > a').addClass('btn btn-success btn-small').click(function(){
        if ($(this).data('original-title') === "In e-Shelf"){
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
    };



    //Javascript to develop/test worldcat search link in primo
    //Robin Schaaf, 1/9/2013
    //University of Notre Dame Hesburgh Libraries


    var worldCatLinks = function(){
      var worldCatBaseUrl = "http://northeastern.worldcat.org/search?q=" ;

      function getWCIndex(exSearch){
        switch (exSearch){
        case 'any':
          return 'kw';
        case 'title':
          return 'ti';
        case 'creator':
          return 'au';
        case 'sub':
          return 'su';
        case 'isbn':
          return 'bn';
        case 'issn':
          return 'n2';
        case 'lsr03':
          return 'se';
        case 'lsr04':
          return 'ut';
        case 'lsr06':
          return 'pb';
        case 'lsr05':
          return 'lc';
        default:
          return 'kw';
        }

      }

      //declaring the variables before if/else
      var $link;
      var searchString = '';
      var searchTerm = '';
      if ($('#exlidAdvancedSearchRibbon').length && !$('#exlidAdvancedSearchRibbon').hasClass('EXLAdvancedBrowseRibbon')){




        //loop through each advanced search row
        $('.EXLAdvancedSearchFormRow').each(function(index) {
          //as long as free text is entered
          if( ($('#input_freeText' + index).length) && ($('#input_freeText' + index).val() !== '')){
            //the dropdowns start with 1
            var ddIndex = index + 1;
            //convert the search type from what's in the dropdown
            //to worldcat's term
            var wcIndex = getWCIndex($('#exlidInput_scope_' + ddIndex).val());

            //for 'constains'search
            var operator = '%3A';
            //for 'exact' search
            if ($('#exlidInput_precisionOperator_' + ddIndex).val() === 'exact'){
              operator = '%3D';
            }

            //construct search string
            searchString += wcIndex + operator + $('#input_freeText' + index).val() + ' ';
          }
        });


        //also language search
        if ($('#exlidInput_language_').val() !== 'all_items'){
          searchString += 'ln' + '%3A' + $('#exlidInput_language_').val() + ' ';
        }



        if (searchString !== ''){
          //replace space with +
          searchString = searchString.replace(/ /g, '+');

          //remove last "+"
          searchString = searchString.substring(0,searchString.length-1);

          //escape quotes
          searchString = searchString.replace(/\"/g, '&quot;');
          searchString = searchString.replace(/\'/g, "\\'");

          $link = $('<a onclick="javascript:window.open(\''+ worldCatBaseUrl + searchString + '\');" href="javascript:void(0);" class="navbar-link" title="Search WorldCat for more results.">Search <img src="../customized/NUdev/images/worldcat-logo.png" width="22" height="22" alt=" "> WorldCat</a>').tooltip();
          //add the worldcat link
          $('.EXLSearchFieldRibbonFormLinks').append($link);
        }

      }
      else if ( $('#search_field').val().length > 0 && typeof jQuery !== 'undefined'){
          searchTerm = $('#search_field').val();

          //escape quotes
          searchTerm = searchTerm.replace(/\"/g, '&quot;');
          searchTerm = searchTerm.replace(/\'/g, "\\'");
          $link = $('<a onclick="javascript:window.open(\''+ worldCatBaseUrl + searchTerm + '\');" href="javascript:void(0);" class="navbar-link" title="Search WorldCat for ' + searchTerm + '">Search <img src="../customized/NUdev/images/worldcat-logo.png" width="22" height="22" alt=" "> WorldCat</a>').tooltip();

          //add the worldcat links
          $('.EXLSearchFieldRibbonAdvancedSearchLink').before($link);
          $link.wrap('<div class="EXLSearchFieldRibbonAdvancedSearchLink"/>');

      }
      else{
        return;
      }
    };



    var buildIcons = function(){
      $('a.EXLBriefResultsPaginationLinkNext').find('img').after('<i class="icon-circle-arrow-right"></i>');
      $('a.EXLBriefResultsPaginationLinkPrevious').find('img').after('<i class="icon-circle-arrow-left"></i>');

      //adding an icon before the RSS link;
      $('form[name="rssForm"]').prepend('<i class="icon-rss"></i>');
      $('.EXLFacetSaveSearchAction > a').before('<i class="icon-save"/>');
      $('.EXLFacetSaveToEShelfAction > a').before('<i class="icon-bookmark"/>');
      $('img[src="../images/icon_popout_tab.png"]').hide().after('<i class="icon-external-link"></i>');
      // $('a.EXLFirstRefinementElement').find('#removeFacet').hide().before('<i class="icon-remove-circle close"/>');
      $('img[src="../images/folders_close_inpage.gif"]').hide().before('<i class="icon-folder-close"></i>');
      $('img[src="../images/folders_open.gif"]').hide().before('<i class="icon-folder-open"></i>');
    };

    var addToolTips = function(){
      $("a#showMoreOptions, a.EXLSearchFieldRibbonAdvancedTwoLinks").tooltip();
    };


    var addActiveStates = function(){
      var $activeStatesTargets = $('.EXLFindDBListHeaderAtoZSelected > a');
      $activeStatesTargets.addClass('active');
    };

    //handle the radio clicks of the dropdown menus on Primo

    var handleRadio = function(){
      var $radios = $('#scopesListContainer').find('input[type="radio"]');
      $radios.click(function(){
        $radios.removeAttr('checked');
      });
    };

    // Build the draggable handle.
    var draggable = function(){
      $('#draggable').html('<i class="icon-resize-vertical"></i>').find('img').hide();
      $('#demoLibId').before($('#draggable'));
    };

    var handleMediaQuerySuport = function(){
      if(!Modernizr.mediaqueries){
        alertOutdatedBrowser();
      }

      Modernizr.load({
        test: ( (Modernizr.mediaqueries) && (typeof respond === 'undefined') ),
        nope: ['https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js']
      });
    };
    /**
     * Alerts the user that their browser isn't compatible with our support browsers and asks the user to upgrade.
     *
     */
    var alertOutdatedBrowser = function(){
      $('#exlidHeaderSystemFeedback').append('<div class="alert alert-danger"><strong>You\'re Using an Outdated Web Browser</strong><br>In order to experience this website properly, please upgrade. Learn more at <a href="http://wiserbrowser.com">www.wiserbrowser.com</a></div>');
    };

    var addEshelfClasses = function(){
      if( $('link[href*="my_shelf"]') && !$('body').hasClass('sos-eshelf') ){
        // Un comment this on  if you need to  remove the old my_shelf Css
        // $('link[href*="my_shelf"]').detach();

        $('body').addClass('sos-eshelf');
        console.log('added sos-eshelf class to body');
      }
    };

    //Build the page functions.
    var init = function(){
      addEshelfClasses();
      $('#search_field').attr('placeholder','Search...');
      draggable();
      eShelfIcons();
      buildFacetCollapse();
      reportAProblem();
      buildIcons();
      addActiveStates();
      handleRadio();
      addToolTips();
      handleMediaQuerySuport();

    };

    return {
      init: init,
      worldCatLinks: worldCatLinks
    };
  })();
  scholarOneSearch.init();
  scholarOneSearch.worldCatLinks();
});



