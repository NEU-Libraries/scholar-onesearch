// Adding support for IE10 and Windows Phone 8
// http://getbootstrap.com/getting-started/#browsers
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
  var msViewportStyle = document.createElement("style");
  msViewportStyle.appendChild(
    document.createTextNode(
      "@-ms-viewport{width:auto!important}"
    )
  );
  document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
}



var scholarOneSearch = (function(){
  "use strict";

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
      var hasAdditionalFacetes = $(this).find("ol.EXLFacetsList > li").hasClass("EXLAdditionalFacet");

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
          if ($('#exlidInput_precisionOperator_' + ddIndex).val() == 'exact'){
            operator = '%3D';
          }

          //construct search string
          searchString += wcIndex + operator + $('#input_freeText' + index).val() + ' ';
        }
      });


      //also language search
      if ($('#exlidInput_language_').val() != 'all_items'){
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

        $link = $('<a onclick="javascript:window.open(\''+ worldCatBaseUrl + searchString + '\');" href="javascript:void(0);" class="navbar-link" title="Search WorldCat for more results.">Search <img src="http://primo-dev.mine.nu/scholar-onesearch/images/worldcat-logo.png" width="22" height="22" alt=" "> WorldCat</a>').tooltip();
        //add the worldcat link
        $('.EXLSearchFieldRibbonFormLinks').append($link);
      }

    }else{ //basic search
      if ($('#search_field').val() !== ''){
        var searchTerm = $('#search_field').val();

        //escape quotes
        searchTerm = searchTerm.replace(/\"/g, '&quot;');
        searchTerm = searchTerm.replace(/\'/g, "\\'");
        $link = $('<a onclick="javascript:window.open(\''+ worldCatBaseUrl + searchTerm + '\');" href="javascript:void(0);" class="navbar-link" title="Search WorldCat for ' + searchTerm + '">Search <img src="http://primo-dev.mine.nu/scholar-onesearch/images/worldcat-logo.png" width="22" height="22" alt=" "> WorldCat</a>').tooltip();

        //add the worldcat links
        $('.EXLSearchFieldRibbonAdvancedSearchLink').before($link);
        $link.wrap('<div class="EXLSearchFieldRibbonAdvancedSearchLink"/>');


      }

    }
  };



  var buildIcons = function(){
    $('a.EXLBriefResultsPaginationLinkNext > img').after('<i class="icon-circle-arrow-right"></i>');
    $('a.EXLBriefResultsPaginationLinkPrevious:first-of-type > img').after('<i class="icon-circle-arrow-left"></i>');

    //adding an icon before the RSS link;
    $('form[name="rssForm"]').prepend('<i class="icon-rss"></i>');
    $('.EXLFacetSaveSearchAction > a').before('<i class="icon-save"/>');
    $('.EXLFacetSaveToEShelfAction > a').before('<i class="icon-bookmark"/>');
    $('img[src="../images/icon_popout_tab.png"]').hide().after('<i class="icon-external-link"></i>');
    $('a.EXLFirstRefinementElement').find('#removeFacet').hide().before('<i class="icon-remove-circle close"/>');
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




  //Build the page functions.
  var init = function(){
    $('#search_field').attr('placeholder','Search...');
    draggable();
    eShelfIcons();
    buildFacetCollapse();
    reportAProblem();
    buildIcons();
    addActiveStates();
    handleRadio();
    addToolTips();
    worldCatLinks();
  };

  return {
    init: init
  };



})();


window.scholarOneSearch = scholarOneSearch;
$(document).ready(scholarOneSearch.init());

