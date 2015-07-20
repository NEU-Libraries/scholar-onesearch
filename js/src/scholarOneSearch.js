/**
 * Scholar OneSearch JS file with-in a closure
 *
 */

if ( typeof jQuery === 'undefined' ){
 throw new Error('jQuery was not found, this is a dependency make sure it is loaded in the front-end before this script');
}
jQuery(function($) {
  var scholarOneSearch = (function(){
    'use strict';
    $('body').append('<div id="permalinkModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true"><div class="modal-dialog modal-vertical-centered"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" >Permalink</h4></div><div class="modal-body" id="permalinkLink"></div></div></div></div>');
    $("html,body").scrollTop(0);
    /**
     * Default Config
     * @type {Object}
     */
    var config = {
      resultClass : 'EXLResult',
      permalLink: {
        icon: function() {
          return $( '<span class="icon-link" aria-hidden="true"></span>' );
        },
        text: 'Permalink',
	//path: '/NU:',
        path: '/primo_library/libweb/action/permalink.do?',
      },


      reportAProblem: {
        baseUrl: 'http://library.northeastern.edu/get-help/tech-support/report-a-problem?resource=',
        title: 'Report a problem',
        icon: function() {
          return $( '<span class="icon-comments-alt" aria-hidden="true"></span><span class="sr-only">Report a problem with this resource</span>' );
        }
      },
      tabTemplate: function(){
        return $('<a href="" title=""  target="_blank"></a>')
      },


    };


    /**
     * Finds the URL path of the assets by finding the source of this script script#sos-app-js
     * @return {string} asset path
     */
    var assettUrl = function(){
      var url = $('script#sos-app-js').attr('src').toString();
      url = url.slice(0, url.search('js/'));
      return url;
    };

    /**
     * Checks to see if the given result is the set class of the DOM
     * @param  { String, Object }  element to test to see if it matches
     * @return {Boolean}         If it matches the node.
     */
    var isResult = function( element ){
      return $( element ).hasClass( config.resultClass );
    };


    /**
     * Get the result ID from the DOM
     * @param  {String Object} resultElement DOM node or
     * @return {[type]}               [description]
     */
    var getID = function( resultElement ){

      var id = ''
      , $result;
      $result = $( resultElement );
      if ( isResult( $result ) ){
        id = $result.find('a.EXLResultRecordId').attr('id');
      }
      return id;

    };
    /**
     * Gets the title of a result DOM node
     * @param  {String || Object } resultElement [description]
     * @return {[type]}               [description]
     */
    var getTitle = function( resultElement ){
      var title = '';
      var $result = $( resultElement );
      if ( isResult( $result ) ){
        title = $result.find('h2.EXLResultTitle').text().trim();
      }
      return title;
    };

    var prepareResult = function( el ){
      var $el = $(el);
      var result = {
        $el: $el,
        id: getID( $el ),
        title: getTitle( $el )
      };

      return result;
    };
    //build report a problem links;
    var reportAProblem = function( result ){


      //The Document ID
      var titleStr = result.title + ' (' + 'http://onesearch.library.neu.edu/NU:' + result.id + ')';
      var url = config.reportAProblem.baseUrl + encodeURIComponent(titleStr);

      var $link = config.tabTemplate();

      $link.attr({
        href: url,
        title: config.reportAProblem.title
      }).addClass('report-a-problem').html( config.reportAProblem.icon() );

      result.$el.find('ul.EXLResultTabs').append($link);

      $link.wrap('<li class="EXLResultTab sos-report-a-problem" />');

      result.$el.find( '.report-a-problem' ).tooltip();

    };

    /**
     * Provides the permalink tab on the tabs ribbon
     * @param  { Object } result result from prepare result.
     * @return { Object }        Dom node
     */
    var buildPemaLink = function( result ){
      var c = config.permalLink;
      if (!window.location.origin) {
        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
      }
      var url = [ window.location.origin ];
      if (result.$el.find('ul.EXLResultTabs .EXLViewOnlineTab').length != 0) {
        url.push( '/NU:' + result.id + '&tabs=viewOnlineTab');
      } else if (result.$el.find('ul.EXLResultTabs .EXLRequestTab').length != 0){
        url.push( '/NU:' + result.id + '&tabs=requestTab');
      }
      url = url.join( '' );
      var $link = config.tabTemplate();
      var icon = c.icon();

      $link.text(c.text).addClass('permalink');
      $link.attr("data-target", "#permalinkModal");
      $link.attr("data-toggle", "modal");
      result.$el.find('ul.EXLResultTabs').append( $link );

      $link.wrap('<li class="EXLResultTab sos-permalink "/>');
      $link.removeAttr("href");
      $link.prepend( icon );
      $link.click(function(event) {
        $("#permalinkLink").html('<input type="text" value="' + url +'" readonly="readonly" onclick="this.select();"/>');
        $('#permalinkModal').modal('toggle');
      });
    };

        /*Build for viewOnline Button to function using ezproxy when external resource being loaded in iframe*/
    var buildViewOnline = function( result ){
         var viewonline = result.$el.find(".EXLViewOnlineTab.EXLResultTabIconPopout a").attr("href");
        var newhref = 'http://ezproxy.neu.edu/login?URL=' + viewonline;
        if (newhref.indexOf("search.proquest.com") >= 0) {
          newhref = newhref + '?accountid=12826';
        }
        result.$el.find(".EXLViewOnlineTab.EXLResultTabIconPopout a").attr("href", newhref);
    }

    function buildFindIt(result) {
      var libname = result.$el.find(".EXLAvailabilityLibraryName").html();
      var collname = result.$el.find(".EXLAvailabilityCollectionName").html();
      if (libname && typeof libname != 'undefined') {
        libname = $.trim(libname);
        if (collname && typeof collname != 'undefined') {
          var findItLink;
          collname = $.trim(collname);
          if (libname == 'School of Law Library') {
            findItLink = "http://library.northeastern.edu/about/maps-directions/floor-maps/where-to-find-library-materials-school-of-law-library";
          } else if (libname == "Snell Library") {
            if (collname == "Stacks") {
              findItLink = "http://library.northeastern.edu/about/maps-directions/floor-maps/where-to-find-library-materials-snell-stacks";
            } else if (collname.toLowerCase().indexOf("archives") >= 0) {
              findItLink = "http://library.northeastern.edu/archives-special-collections/visitors";
            } else if (collname.toLowerCase().indexOf("storage") >= 0) {
              findItLink = "";
            } else if (collname.toLowerCase().indexOf("periodical") >= 0) {
              findItLink = "http://library.northeastern.edu/about/maps-directions/floor-maps/where-to-find-library-materials-periodical-stacks";
            } else {
              findItLink = "http://library.northeastern.edu/about/maps-and-directions/floor-maps";
            }
          } else {
            findItLink = "http://library.northeastern.edu/about/maps-and-directions/floor-maps";
          }
            var resultavail = result.$el.find(".EXLResultAvailability");
            resultavail.find(".findit").remove();
            findItLink = "<a href='" + findItLink + "' class='btn btn-default btn-xs findit' target='_blank'>Find It</a>";
            resultavail.append(findItLink);
            if (collname.toLowerCase().indexOf("storage") >= 0) {resultavail.find(".findit").remove();}
            if(resultavail.find(".EXLResultStatusAvailable").html().toLowerCase().indexOf("other locations") >= 0) {
              resultavail.find(".findit").remove();
            }
        }
      }
    }

    function fixArchiveThumbnail(result){
      if (result.hasClass('EXLResultMediaTYPEarchival_material')){
        console.log(this is an archives material);
        var thumbnail = result.find(".EXLThumbnailLinkMarker img");
        thumbnail.attr("src", "../images/icon_archive.png");
      }
    }



    /**
     * handleResults returns a buildLinks function that adds tabs to the results tab
     */
    var handleResults = function(){
      var buildLinks = function(){
        var result = prepareResult( $(this)  );
        buildPemaLink( result );
        reportAProblem( result );
        buildViewOnline( result );
        fixArchiveThumbnail( result );
        setTimeout(function() {
          buildFindIt(result);
        }, 1000)
      };
      var $results = $('.' + config.resultClass );
      $results.each( buildLinks );

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

        // if( i > 0 && hasAdditionalFacetes ){
        if(hasAdditionalFacetes){
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

      /*$('li.EXLFacetsDisplayMore').find('a').html('Show more options<i class="icon-gear icon-large pull-right"/>').attr({
          title: "Refine your search more."
      }).tooltip();*/
          $('li.EXLFacetsDisplayMore').find('a').html('Show more options<i class="icon-gear icon-large pull-right"/>').attr({
                title: "Refine your search more.",
            }).attr('data-target','#exliWhiteContent').attr('data-toggle','modal').tooltip().click(function(e) {
                $("#exliWhiteContent").addClass("modal").addClass("fade").attr("role","dialog").attr("aria-labelledby","modal");
                populateMultipleFacetsLightBox($(this));
                $("#exliGreyOverlay").hide();
                $("#exliWhiteContent").css("z-index", "");
                $("#exliWhiteContent").modal('toggle');
            });

    };

    // Persistent Sign In Message
    var signInReminder = function() {
      //Adding the Sign-in Prompt on Brief results only
      if ($('#exlidSignOut').hasClass('EXLHidden') && $("#exlidFacetTile").length != 0) {
          var signInLink = $('#exlidSignIn a').attr('href');
          var msg = "<a href='" + signInLink + "'>Sign in<a/> for enhanced features and complete results.";
          $('#exlidHeaderSystemFeedback').append('<div id="exlidHeaderSystemFeedbackContent" class="EXLSystemFeedback"><strong>' + msg + '</strong></div>');
      }
      //Hiding the Sign-blurb from the main page if signed in
      if ($("#exlidSignIn").hasClass("EXLHidden")) {
          $("#signInHomeBody strong").hide();
      }
    };
    // Build the eShelf icons
    var  eShelfIcons = function(){
      //helper function to toggle between label text;
      function toggleEShelf(event){
        var $link = $(this);
        $link.data('eshelf', $link.data('eshelf') == 'true' ? 'false' : 'true');
        var newTitle =  ( $link.data('eshelf') == 'true') ?  'In e-Shelf' : 'Add to e-Shelf' ;
        var newBoolean = ( $link.data('eshelf') == 'true') ?  false : true ;

        $link
          .attr('data-eshelf', newBoolean)
            .attr( 'aria-checked' , newBoolean );
        $link
          .attr('title', newTitle);
        $link.tooltip('fixTitle');

        $link.find('i').toggleClass('icon-bookmark-empty').toggleClass('icon-bookmark');
        $link.find('.sr-only').text( helpText(newBoolean) );
        return $link;
        event.stopPropagation();
      }
      var result = $('tr.EXLResult');
      if (result.length > 0){
        //iterate through each result for the id the e-shelf div
        result.each( function( index ){
          var labelId = 'eShelfbuttonLabel' + index ;
          var link = $(this).find('td.EXLMyShelfStar > a');
          var img = link.find('img');
          var eShelf = ( img.attr('alt') === "In e-Shelf" );

          var icon = eShelf ? $('<i/>').addClass('icon-bookmark icon-large') : $('<i/>').addClass('icon-bookmark-empty icon-large');
          link.attr('data-eshelf' , eShelf )
            .attr('id', 'eshelfLink' + index )
            .attr('aria-labelledby', labelId )
            .attr( 'aria-role', 'checkbox')
            .attr( 'aria-checked' , eShelf )
            .addClass('btn btn-success btn-small')
            .tooltip({
              title: "Add to e-Shelf"
            })
              .click(toggleEShelf);
          img
            .after( $('<span id="' + labelId + '" class="sr-only">' + helpText(eShelf) + '</span>' ) )
            .after( icon )
            .hide();

        });

      }
    };



    //Javascript to develop/test worldcat search link in primo
    //Robin Schaaf, 1/9/2013
    //University of Notre Dame Hesburgh Libraries


    var worldCatLinks = function(){
      var worldCatBaseUrl = 'http://northeastern.worldcat.org/search?q=' ;
      if( worldcatLogo === undefined){
        var worldcatLogo = '../customized/NU/images/worldcat-logo.png';
      }
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
      var $searchField = $('#search_field');
      var searchTerm = $searchField.val() || '';
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
        if (($("#exlidInput_language_").length > 0) && ($('#exlidInput_language_').val() !== 'all_items')){
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

          $link = $('<a onclick="javascript:window.open(\''+ worldCatBaseUrl + searchString + '\');" href="javascript:void(0);" class="navbar-link" title="Search WorldCat for more results.">Search <img src="'+ worldcatLogo +'" width="22" height="22" alt=" "> Other Libraries</a>').tooltip();
          //add the worldcat link
          $('.EXLSearchFieldRibbonFormLinks').append($link);
        }

      }
      else if ( searchTerm.length > 0 ){

          //escape quotes
          searchTerm = searchTerm.replace(/\"/g, '&quot;');
          searchTerm = searchTerm.replace(/\'/g, "\\'");
          $link = $('<a onclick="javascript:window.open(\''+ worldCatBaseUrl + searchTerm + '\');" href="javascript:void(0);" class="navbar-link" title="Search Other Libraries for ' + searchTerm + '">Search <img src="'+ worldcatLogo +'" width="22" height="22" alt=" "> Other Libraries</a>').tooltip();

          //add the worldcat links
          $('.EXLSearchFieldRibbonAdvancedSearchLink').before($link);
          $link.wrap('<div class="EXLSearchFieldRibbonAdvancedSearchLink"/>');

      }
      else{
        return false;
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
      if(!Modernizr.mediaqueries|!Modernizr.input.placeholder){
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
      $('#exlidHeaderContainer').append('<div class="alert alert-danger"><strong>You\'re Using an Outdated Web Browser</strong><br>In order to experience this website properly, please upgrade. Learn more at <a href="http://whatbrowser.com">www.whatbrowser.com</a></div>');
    };


    /**
     * Handle Accessibility Issues with SOS
     *
     */
    var a11y = function(){
      if( Modernizr != null ){
        Modernizr.load({
          test: false,
          nope: ['//yatil-cdn.s3.amazonaws.com/accessifyhtml5.min.js'],
          complete: function(){
            //variable for the main container
            var main;
            //Query the Dom for the landmark roles to apply
            if($('#exlidResultsContainer').length > 0 ){
              main = '#exlidResultsContainer';
            }else if ($('#exlidHomeContainer').length > 0 ){
              main = '#exlidHomeContainer';
            }else{
              main = '#exlidMyAccountContainer';
            }
            var moreFixes = {
              '.EXLSearchWrapper' : {'role': 'search'  },
              '.EXLMyAccountTabsRibbon' : {'role': 'tablist'  },
              '.EXLMyAccountSelectedTab' : {'role': 'tab'},
              '.EXLMyAccountContainer' : {'role': 'tabpanel'},
              '.tooltip': {'role' : 'tooltip'},
              '.exlidFacetsLightboxContainer' : {'role': 'dialog'},
              '#exlidFacetTile': {'role': 'complementary'},
              '#showMoreOptions': {'aria-labeledby': '#scopesList .EXLHiddenCue'},
              '.EXLThumbnail' : { 'aria-hidden': true }



            }
             AccessifyHTML5({
              header:"#exlidHeaderContainer",
              footer: '.EXLFooterTile',
              main: main
            }, moreFixes );
          }
        });
      }
    };
    /**
     * See issue #100
     * @link https://github.com/NEU-Libraries/scholar-onesearch/issues/100
     *
     * Shim function to fix issues only on the my account page.
     */
    var shimEXLMyAccountTableActions = function(){
      var renewAllButton = $('#renewAllButton');

      renewAllButton.closest('td').before($('<td/><td/><td/><td/><td/><td/>'))
      .find('a').addClass('btn btn-default btn-xs btn-block small');

    }


    //For bootstrap Tour
    //Build the tour function
    var tour = new Tour({
      backdrop: true,
      debug: true,
      autoscroll: true,
      template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><button class='tour-close close' data-role='end'></button><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>Prev</button><span data-role='separator'></span><button class='btn btn-default' data-role='next'>Next</button><button class='btn btn-default' data-role='end'>End</button></div></nav></div>",
      onEnd: function() {
      document.location.href = "/";
      },
      steps:[
      {
      element: "#search_field",
      title: "Search field",
      placement: "bottom",
      content: "In this field you can enter your search term(s) whether it be a title, author, or other piece of information",
      backdropPadding: "left"
      },
      {
      element: "#showMoreOptions",
      title: "Choose a Search Scope",
      placement: "bottom",
      content: "Use the drop down menu to choose between different search scopes:<ul><li>Library Catalogs + Articles searches all NU Libraries content and beyond, including books, articles, journals, media, and more.</li><li>Library Catalogs searches print and electronic materials in local collections, except for articles.</li><li>Law Library Catalog searches the NU Law Library’s holdings.</li></ul>",
      backdropPadding: "left"
      },
      {
      element: "#exlidSignIn a",
      title: "Remember to Sign In",
      placement: "left",
      content: "Sign in to Scholar OneSearch with your myNEU credentials to see more complete results and to customize your search experience.",
      orphan:true,
      onNext: function(){
      document.location.href = '/primo_library/libweb/action/search.do?fn=search&ct=search&initialSearch=true&mode=Basic&tab=default_tab&indx=1&dum=true&srt=rank&vid=NU&frbg=&vl%28freeText0%29=neuroscience&scp.scps=scope%3A%28NEU%29%2Cprimo_central_multiple_fe#exlidFacet0';  tour.setCurrentStep(3);
      return (new jQuery.Deferred()).promise();
      },
      },
      {
      element: "#facetList",
      title: "Refine your Results",
      placement: "top",
      content: "Use any combination of filters after searching to find exactly the results you need."
      },
      {
      element: "#resultsNumbersTile",
      title: "Sort your Results",
      placement: "top",
      content: "Order your search results by relevance, date, popularity, author, or title. ",
      orphan:true,
      backdropPadding: "left"
      },

      {
      element: "#exlidResult1 .EXLMyShelfStar",
      title: "Add to e-Shelf",
      placement: "bottom",
      content: "Save items to your list of results. Sign in to make sure they’re saved for later",
      },
      {
      element: "#exlidResult1 .sos-report-a-problem",
      title: "Report a Problem",
      placement: "top",
      content: "Let us know if something's not working",
      backdropPadding: "right"
      },
      {
      element: "#exlidMainMenuRibbon",
      title: "Other Helpful Resources",
      placement: "bottom",
      content: "Checkout these links for helpful resources",
      backdropPadding: "left",
      onShown: function() { $("#exlidMainMenuRibbon").css("background", "#FFFFFF");}
      },
      {
      element: ".EXLSearchFieldRibbonBrowseSearchLink",
      title: "Browse Search",
      placement: "bottom",
      content: "Explore by subject, title, author, or call number",
      backdropPadding: "left"
      }
      ]
    });

    //Build the page functions.
    var init = function( settings ){
      var settings = settings || {}
      $.extend( config , settings )

      var href = window.location.href;

      if(href.search('myAccountMenu.do') > 0 ){
        shimEXLMyAccountTableActions();
      }else if( href.search('basket.do')){
        draggable();
      }

      $('#search_field').attr('placeholder','Search...');
      //hides simple search link for nu_journals view
      if ($("#vid").val() == 'NU_JOURNALS') {
        $(".EXLSearchFieldRibbonFormLinks").hide();
        $("#exlidSearchIn").prop("disabled", true);
      }
      //add Journal Title Search Link to advanced search page (explictly not the browse search page which also uses the advancedsearchribbon class)
      $("body").not(".EXLBrowseList").find("#exlidAdvancedSearchRibbon .EXLSearchFieldRibbonFormLinks").append('<a href="search.do?mode=Advanced&ct=AdvancedSearch&dscnt=0&vid=NU_JOURNALS">Journal Title Search</a>');
      //add message about paying Fines
      if($("#FinesAndFeesTable")) {
        $("<div class='alert alert-warning'>These are your library fines for this week only. For total fines, check your Northeastern Student Account or contact <a href='mailto:circulation@neu.edu'>circulation@neu.edu</a>.</div>").insertAfter("#FinesAndFeesTable");
      }

      draggable();
      eShelfIcons();
      signInReminder();
      buildFacetCollapse();
      handleResults();
      buildIcons();
      addActiveStates();
      handleRadio();
      addToolTips();
      handleMediaQuerySuport();
      a11y();
      // Initialize the tour
      tour.init();
      // Start the tour
      $("#tour_start").click(function(){
        tour.restart();
        ga('send', 'event', 'tour', 'click', 'Tour start');
      });

      //for tooltip to stop jumping
      $('[rel=tooltip]').tooltip({container: 'body'});

    };

    return {
      init: init,
      worldCatLinks: worldCatLinks,
      config : config
    };
  })();
  // You can override the modules setting using the init method.
  // scholarOneSearch.init({
  //   resultClass : 'tr.EXLResult'
  // });
  scholarOneSearch.init();
  scholarOneSearch.worldCatLinks();

});

//modifying eshelf functionality to allow for toggling of icon
function eshelfCreate(element,recordId,remote,scopes,index){
  updateBasket(recordId,true,remote,scopes,index);
  eshelfUpdate(element,true);
  toggleshelf(element);
  return false;
}
function eshelfRemove(element,recordId,remote,scopes,index){
  updateBasket(recordId,false,remote,scopes,index);
  eshelfUpdate(element,false);
  toggleshelf(element);
  return false;
}
function toggleshelf(element) {
  var table = $(element).closest("td");
  var eshelf = table.prev("td.EXLMyShelfStar");
  var $link = eshelf.find("a");
  $link.find('i').toggleClass('icon-bookmark-empty').toggleClass('icon-bookmark');
  var newTitle =  ( $link.data('eshelf') == 'true') ?  'In e-Shelf' : 'Add to e-Shelf' ;
  var newBoolean = ( $link.data('eshelf') == 'true') ?  false : true ;
  $link
    .attr('data-eshelf', newBoolean)
      .attr( 'aria-checked' , newBoolean )
        .attr('title', newTitle);
  $link.tooltip('fixTitle');
  $link.find('.sr-only').text( helpText(newBoolean) );
}
function helpText(boolean){
  var helpText = "e-Shelf Action. ";
  var stub =  boolean ? 'Item in e-Shelf, click to remove' : 'Item not in e-Shelf, click to add';
  helpText = helpText + stub;
  return helpText;
}

//for permalink action link functionality
function openPermaLinkLbox(action,parameters,recordIndex,recordId){
  var recordElement=$('#exlidResult'+recordIndex);
  if(isFullDisplay()){
    var recordElement=$('#resultsListNoId');
  }
  var url = [ window.location.origin ];
  if (recordElement.find('ul.EXLResultTabs .EXLViewOnlineTab').length != 0) {
    url.push( '/NU:' + recordId + '&tabs=viewOnlineTab');
  } else if (recordElement.find('ul.EXLResultTabs .EXLRequestTab').length != 0){
    url.push( '/NU:' + recordId + '&tabs=requestTab');
  }
  url = url.join( '' );
  $("#permalinkLink").html('<input type="text" value="' + url +'" readonly="readonly" onclick="this.select();"/>');
  $('#permalinkModal').modal('toggle');
}

/*for show more options modals THESE ARE DIRECTLY COPIED FROM THE PRIMO JS FILE EXCEPT FOR ONE MARKED ADDED LINE*/
function populateMultipleFacetsLightBox(clickedElement){
  addLightBoxDivs();
  var currentFacetGroupId=$(clickedElement).parents('div.EXLFacetContainer').attr('id');
  var currentFacetGroup=currentFacetGroupId.substring(10);
  fn='multipleFacets';
  openPrimoLightBox('search','multipleFacets','multipleFacetsXml','&facetGroupId='+currentFacetGroup,'isMultipleFacetsAjaxRequest=true');
}
function openPrimoLightBox(action,fn,elementReturned,additionalParameters,urlParameters,additionalSucessHandler,alignLightBox,clickedElement){
  $('#exliWhiteContent').css('z-index','1002');
  addLoadingLBox();
  $('#exliLoadingFdb').css('top',0);
  addLightBoxDivs(alignLightBox,clickedElement);
  var timestamp=new Date().getTime();
  var url="";
  var mode=$('#mode').val();
  if(action!="searchDB"){
    url=action+".do"+"?fn="+fn+"&ts="+timestamp+additionalParameters;
  } else {
    url=action+".do"+"?fn="+fn+"&ts="+timestamp;
    if(additionalParameters=="IamDeepLink"){
      document.getElementById('flagForFindDbDeepLink').title="DeepLink";
    }
    else{
      if(additionalParameters=="IamDeepLinkToMyDatabases"){
        document.getElementById('flagForFindDbDeepLink').title="DeepLinkToMyDatabases";
      } else {
        document.getElementById('flagForFindDbDeepLink').title="NotADeepLink";
      }
    }
  }
  url=url+"&mode="+mode+"&"+urlParameters;
  var data;
  $.ajax({
    url:url,
    data:data,
    dataType:'xml',
    global:false,
    beforeSend:function(request){
      setAjaxRequestHeader(request);
    },
    error:function(request,errorType,exceptionOcurred){
      if(errorType=='timeout'){
        notifyAjaxTimeout();
      } else {
        generalAjaxError();
      }
      document.getElementById('exliLoadingFdb').style.display='none';
      $('#exliLoadingFdb').css('top',0);
      document.getElementById('exliGreyOverlay').style.display='none';
      document.getElementById('exliWhiteContent').style.display='none';
      return false;
    },
    success:function(data){
      if(isAjaxXmlRedirect(data)){
        handleAjaxXmlRedirect(data);
      }
      var elm=$(data).find(elementReturned);
      var cdata=$(elm).text();
      var n;
      n=document.getElementById("exliWhiteContent");
      if(additionalParameters=="IamDeepLinkToMyDatabases"&$(".EXLMyAccountSelectedTab").length>0){
        var id=$(".EXLMyAccountSelectedTab").attr("id");
        $("#"+id).removeClass("EXLMyAccountSelectedTab");
        $("#exlidMyDatabasesTab").addClass("EXLMyAccountSelectedTab");
        $("#savedSelectedMyAccountTab").attr("title",id);
      }
      var xmlText=cdata.replace(/\n\n/g,"\n").replace(/&lt;/g,"<").replace(/&gt;/g,">");
      var newdiv=document.createElement("div");
      newdiv.id='exliPrimoLightBoxdiv';
      newdiv.innerHTML=xmlText;
      n.innerHTML='';
      $(n).append(newdiv);
      $(n).find(".EXLReset").attr("data-dismiss","modal");/*ADDED*/
      document.getElementById('exliLoadingFdb').style.display='none';
      if(!alignLightBox){
        $('#exliLoadingFdb').css('top',0);
        $('#exliWhiteContent').show();
        $('#exliPrimoLightBoxdiv').attr("tabindex",-1).focus();
      } else {
        setLBPosition(clickedElement,1);
        $('#exliWhiteContent').show();
        $('#exliWhiteContent').first('a').attr("tabindex",-1).focus();
      }
      if(additionalSucessHandler!=null){
        additionalSucessHandler(additionalParameters);
      }
    }
  });
}
