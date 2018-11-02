
(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
    (i[r].q = i[r].q || []).push(arguments);
  }, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m);
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

(function () {
  "use strict";
  'use strict';

  //need to figure out how to pass in view code instead of hardcoding to NU for image path

  // var app = angular.module('viewCustom', ['angularLoad']); // 'ngSanitize']);

  // angularLoad.loadScript('http://localhost:8003/primo-explore/custom/NU/js/tether.js').then(function() {
  // 	// Script loaded succesfully.
  // 	// We can now start using the functions from someplugin.js
  // }).catch(function() {
  //     // There was some error loading the script. Meh
  // });

  /****************************************************************************************************/

  /*In case of CENTRAL_PACKAGE - comment out the below line to replace the other module definition*/

  /*var app = angular.module('centralCustom', ['angularLoad']);*/

  /****************************************************************************************************/
  
  // Begin BrowZine - Primo Integration...

// Define Angular module and whitelist URL of server with Node.js script
var app = angular.module('viewCustom', ['angularLoad'])
  .constant('nodeserver', "https://apiconnector.thirdiron.com/v1/libraries/545")
  .config(['$sceDelegateProvider', 'nodeserver', function ($sceDelegateProvider, nodeserver) {
    var urlWhitelist = $sceDelegateProvider.resourceUrlWhitelist();
    urlWhitelist.push(nodeserver + '**');
    urlWhitelist.push('https://proxy-na.hosted.exlibrisgroup.com/**');
    $sceDelegateProvider.resourceUrlWhitelist(urlWhitelist);
}]);

// Add Article In Context & BrowZine Links
  app.controller('prmSearchResultAvailabilityLineAfterController', function($scope, $http, nodeserver) {
    var vm = this;
    $scope.book_icon = "https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png";
    if (vm.parentCtrl.result.pnx.addata.doi && vm.parentCtrl.result.pnx.display.type[0] == 'article')  {
          vm.doi = vm.parentCtrl.result.pnx.addata.doi[0] || '';
          var articleURL = nodeserver + "/articles?DOI=" + vm.doi;
          $http.jsonp(articleURL, {jsonpCallbackParam: 'callback'}).then(function(response) {
            $scope.article = response.data;
          }, function(error){
            console.log(error);
            });
      }
      if (vm.parentCtrl.result.pnx.addata.issn && vm.parentCtrl.result.pnx.display.type[0] == 'journal')  {
          vm.issn = vm.parentCtrl.result.pnx.addata.issn[0].replace("-", "") || '';
          var journalURL = nodeserver + "/journals?ISSN=" + vm.issn;
          $http.jsonp(journalURL, {jsonpCallbackParam: 'callback'}).then(function(response) {
            $scope.journal = response.data;
          }, function(error){
            console.log(error);
            });
        }

  });

// Below is where you can customize the wording that is displayed (as well as the hover over text) for the BrowZine links.
// St Olaf has chosen "View Journal Contents" for the "Journal Availability Link" but other great options include things such as "View Journal" or "View this Journal"
// St Olaf is using "View Issue Contents" for the "Article in Context" link but another great option is "View Complete Issue" or "View Article in Context".
// St Olaf also has added a hover over link that says "Via BrowZine" to emphasize the interaction being used.

app.component('prmSearchResultAvailabilityLineAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'prmSearchResultAvailabilityLineAfterController',
  template: '<div ng-if="article.data.browzineWebLink"><a href="{{ article.data.browzineWebLink }}" target="_blank" title="Via BrowZine">&nbsp; View Issue Contents in BrowZine <md-icon md-svg-icon="primo-ui:open-in-new" aria-label="icon-open-in-new" role="img" class="browzine-external-link"><svg id="open-in-new_cache29" width="100%" height="100%" viewBox="0 0 24 24" y="504" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"></svg></md-icon></a></div><div ng-if="journal.data[0].browzineWebLink"><a href="{{ journal.data[0].browzineWebLink }}" target="_blank" title="Via BrowZine">&nbsp; View Recent Issues in BrowZine <md-icon md-svg-icon="primo-ui:open-in-new" aria-label="icon-open-in-new" role="img" class="browzine-external-link"><svg id="open-in-new_cache29" width="100%" height="100%" viewBox="0 0 24 24" y="504" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"></svg></md-icon></a></div>'
});

// Add Journal Cover Images from BrowZine
app.controller('prmSearchResultThumbnailContainerAfterController', function ($scope, $http, nodeserver) {
  var vm = this;
  var newThumbnail = '';
  // checking for item property as this seems to impact virtual shelf browse (for reasons as yet unknown)
  if (vm.parentCtrl.item && vm.parentCtrl.item.pnx.addata.issn) {
  //if (vm.parentCtrl.item.pnx.addata.issn) {
    vm.issn = vm.parentCtrl.item.pnx.addata.issn[0].replace("-", "") || '';
    //console.log("ISSN: " + vm.issn);
    var journalURL = nodeserver + "/journals?ISSN=" + vm.issn;
    $http.jsonp(journalURL, { jsonpCallbackParam: 'callback' }).then(function (response) {
      if (response.data.data["0"] && response.data.data["0"].browzineEnabled)  {
        newThumbnail = response.data.data["0"].coverImageUrl;
    	//console.log("Thumb: " + newThumbnail);
      }
    }, function (error) {
      console.log(error); //
    });
  }
  vm.$doCheck = function (changes) {
    if (vm.parentCtrl.selectedThumbnailLink) {
      if (newThumbnail != '') {
        vm.parentCtrl.selectedThumbnailLink.linkURL = newThumbnail;
      }
    }
  };
});

app.component('prmSearchResultThumbnailContainerAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'prmSearchResultThumbnailContainerAfterController'
});
// End BrowZine - Primo Integration


  /*add worldcat passthrough*/
  app.component('prmSearchBarAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'SearchBarAfterController'
  });
  app.controller('SearchBarAfterController', ['$scope', function ($scope) {
    var vm = this;
    angular.element(document).ready(function () {
      vm.parentCtrl.showTabsAndScopes = 1;
      var node = document.getElementById('worldcat-button');
      if (node) {
        document.getElementsByClassName('search-elements-wrapper')[0].append(node);
        if (!node.classList.contains("hide-sm")) {
          node.className += " hide-sm";
        }
      }
      var mobile_node = document.getElementById('worldcat-mobile-button');
      if (mobile_node) {
        document.getElementsByClassName('search-actions')[0].prepend(mobile_node);
        if (!mobile_node.classList.contains("hide-gt-sm")) {
          mobile_node.className += " hide-gt-sm";
        }
      }
      document.getElementsByClassName('search-actions')[0].children[0].classList.remove("hide-gt-xs");
      document.getElementsByClassName('search-actions')[0].children[0].className += " hide-gt-sm";
      document.getElementsByClassName('search-switch-buttons')[0].classList.remove("hide-xs");
      document.getElementsByClassName('search-switch-buttons')[0].className += " hide-sm";
      document.getElementsByClassName('search-elements-wrapper')[0].classList.remove("flex-sm-85");
    });
  }]);

  app.component('prmSearchAfter', {
    template: '<md-button ng-click="$ctrl.worldcatPassthrough()" id="worldcat-button" aria-label="Search Other Libraries">Search <img ng-src="custom/NU/img/worldcat-logo.png"/>Other Libraries</md-button><md-button ng-click="$ctrl.worldcatPassthrough()" id="worldcat-mobile-button" aria-label="Search Other Libraries"> <img ng-src="custom/NU/img/worldcat-logo.png"/> </md-button>',
    bindings: { parentCtrl: '<' },
    controller: 'SearchAfterController'
  });

  app.controller('SearchAfterController', ['$window', function ($window) {
    var vm = this;
    vm.getQuery = getQuery;
    vm.worldcatPassthrough = worldcatPassthrough;

    function getQuery() {
      return vm.parentCtrl.searchFieldsService._mainSearch;
    }

    function worldcatPassthrough() {
      var query = getQuery();
      $window.open("https://northeastern.on.worldcat.org/search?databaseList=638&queryString=" + query);
    }

    if (vm.parentCtrl.isSearchDone() == true && document.getElementsByTagName('primo-explore')[0].classList.contains("__gt-sm")) {
      document.getElementById('worldcat-button').classList.add("show-md"); // = 'block';
      document.getElementById('worldcat-button').classList.remove("hide");
    } else if (vm.parentCtrl.isSearchDone() != true) {
      document.getElementById('worldcat-button').classList.add("hide");
    }

    /*show tabs and scopes by default */
    vm.$onInit = function () {
      vm.parentCtrl.showTabsAndScopes = 1;
      if (!document.getElementById('worldcat-mobile-button').classList.contains("hide-gt-sm")) {
        document.getElementById('worldcat-mobile-button').className += " hide-gt-sm";
      }
      if (!document.getElementById('worldcat-button').classList.contains("hide-sm")) {
        document.getElementById('worldcat-button').className += " hide-sm";
      }
      document.getElementsByTagName('prm-search-after')[0].classList.add("hide"); //hide the prm-search-after since we move the buttons out of it for display
    };
    /*end show tabs and scopes by default */
  }]);
  /*end add worldcat passthrough*/

  /*make lib logo clickable*/
  app.controller('prmLogoAfterController', ['$scope', '$window', function ($scope, $window) {
    var vm = this;
    vm.getView = getView;

    function getView() {
      return $window.appConfig.vid;
    }
  }]);

  app.component('prmLogoAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmLogoAfterController',
    template: '<div class="product-logo product-logo-local" layout="row" layout-align="start center" layout-fill id="banner" tabindex="0" role="banner">' + '<a href="http://library.northeastern.edu">' + '<img class="logo-image" alt="{{::(&apos;nui.header.LogoAlt&apos; | translate)}}" ng-src="custom/NU/img/nu-libraries-logo.svg"/></a>' + '<a href="/primo-explore/search?vid={{$ctrl.getView()}}">' + '<img class="logo-image sos" alt="{{::(&apos;nui.header.LogoAlt&apos; | translate)}}" ng-src="custom/NU/img/sosbold.svg"/></a></div>'
  });
  /*end make lib logo clickable*/

  /*add report a problem*/
  app.controller('prmActionListAfterController', ['$scope', function ($scope) {
    var vm = this;
    vm.$onInit = function () {
      vm.prmActionCtrl.actionLabelNamesMap["report_a_problem"] = "Report a Problem";
      vm.prmActionCtrl.actionIconNamesMap["report_a_problem"] = "report_a_problem";
      vm.prmActionCtrl.actionIcons["report_a_problem"] = {
        icon: "ic_announcement_24px",
        iconSet: "action",
        type: "svg"
      };
      //TODO - what about if something gets added to this list - may need to refactor for loop
      if (!vm.prmActionCtrl.actionListService.actionsToIndex["report_a_problem"]) {
        vm.prmActionCtrl.actionListService.requiredActionsList.unshift("report_a_problem");
        vm.prmActionCtrl.actionListService.actionsToDisplay.unshift("report_a_problem");
        vm.prmActionCtrl.actionListService.actionsToIndex["report_a_problem"] = 1;
      }
        var url = "https://northeastern.libanswers.com/form.php?queue_id=2155&resource=" + vm.prmActionCtrl.item.pnx.display.title[0] + " (http://onesearch.library.northeastern.edu/primo-explore/fulldisplay?" + encodeURIComponent("docid=" + vm.prmActionCtrl.item.pnx.control.recordid + "&context=L&vid=NU&search_scope=new_everything_scope&tab=default_tab&lang=en_US") + ")";

      if (vm.prmActionCtrl.actionListService.onToggle) {
        vm.prmActionCtrl.actionListService.onToggle["report_a_problem"] = function () {
          window.open(url, '_blank');
        };
      }
      if (vm.prmActionCtrl.onToggle) {
        vm.prmActionCtrl.onToggle["report_a_problem"] = function () {
          window.open(url, '_blank');
        };
      }
    };
  }]);
  app.component('prmActionListAfter', {
    require: {
      prmActionCtrl: '^prmActionList'
    },
    controller: 'prmActionListAfterController'
  });

  app.controller('prmBriefResultContainerAfterController', ['$scope', function ($scope) {
    var vm = this;
    vm.$onInit = function () {
      vm.prmBriefResultCtrl.upFrontActionsService.actionIconNamesMap["report_a_problem"] = "report_a_problem";
      vm.prmBriefResultCtrl.upFrontActionsService.actionLabelNamesMap["report_a_problem"] = "Report a Problem";
      vm.prmBriefResultCtrl.actionsIcons["report_a_problem"] = {
        icon: "ic_announcement_24px",
        iconSet: "action",
        type: "svg"
      };
      //TODO - what about if something gets added to this list - may need to refactor for loop
      var index = vm.prmBriefResultCtrl.upFrontActionsService.requiredUpFrontActionsList.length;
      if (vm.prmBriefResultCtrl.upFrontActionsService.requiredUpFrontActionsList[0] != "report_a_problem") {
        // ensure we aren't duplicating the entry
        if (index > 1) {
          vm.prmBriefResultCtrl.upFrontActionsService.requiredUpFrontActionsList[index - (index - 2)] = vm.prmBriefResultCtrl.upFrontActionsService.requiredUpFrontActionsList[1];
        }
        vm.prmBriefResultCtrl.upFrontActionsService.requiredUpFrontActionsList[index - (index - 1)] = vm.prmBriefResultCtrl.upFrontActionsService.requiredUpFrontActionsList[0];
        vm.prmBriefResultCtrl.upFrontActionsService.requiredUpFrontActionsList[0] = "report_a_problem";
      }

        var url = "https://northeastern.libanswers.com/form.php?queue_id=2155&resource=" + vm.prmBriefResultCtrl.item.pnx.display.title[0] + " (http://onesearch.library.northeastern.edu/primo-explore/fulldisplay?" + encodeURIComponent("docid=" + vm.prmBriefResultCtrl.item.pnx.control.recordid + "&context=L&vid=NU&search_scope=new_everything_scope&tab=default_tab&lang=en_US") + ")";
	
      vm.prmBriefResultCtrl.openTab = function (e, t) {
        e.stopPropagation();
        if (t == "report_a_problem") {
          window.open(url, '_blank');
        } else {
          this.openItemMenu(e);
          this.selectedAction = t;
        }
      };
    };
  }]);
  app.component('prmBriefResultContainerAfter', {
    require: {
      prmBriefResultCtrl: '^prmBriefResultContainer'
    },
    controller: 'prmBriefResultContainerAfterController'
  });
  /*end add report a problem*/

  /*add proquest account id for service link*/
  app.controller('prmServiceLinksAfterController', ['$scope', function ($scope) {
    var vm = this;
    vm.$onInit = function () {
      angular.forEach(vm.prmServiceLinksCtrl.recordLinks, function (value, key) {
        if (value.linkURL.indexOf("search.proquest.com") >= 0) {
          value.linkURL = value.linkURL + "?accountid=12826";
        }
      });
    };
  }]);
  app.component('prmServiceLinksAfter', {
    require: {
      prmServiceLinksCtrl: '^prmServiceLinks'
    },
    controller: 'prmServiceLinksAfterController'
  });
  /*ends add proquest account id for service link*/

  /*add journal title search link to advanced search*/
  app.controller('prmAdvancedSearchAfterController', ['$window', function ($window) {
    var vm = this;
    vm.journalTitleSearch = journalTitleSearch;
    angular.element(document).ready(function () {
      var node = document.getElementById("journal_title_search");
      document.getElementsByTagName('prm-advanced-search')[0].children[0].children[0].children[1].children[1].append(node);
    });

    function journalTitleSearch() {
      var node = document.getElementById("journal_title_search");
      if (node.textContent == "Journal Title Search") {
        vm.parentCtrl.materialType.selection = vm.parentCtrl.materialType.options[2];
        vm.parentCtrl.scope = vm.parentCtrl.scopesOptions[1];
        vm.parentCtrl.rowArray[0].searchCategory = "title";
        node.textContent = "Advanced Search";
      } else {
        vm.parentCtrl.materialType.selection = vm.parentCtrl.materialType.options[5];
        vm.parentCtrl.scope = vm.parentCtrl.scopesOptions[0];
        vm.parentCtrl.rowArray[0].searchCategory = "any";
        var node = document.getElementById("journal_title_search");
        node.textContent = "Journal Title Search";
      }
    }
  }]);
  app.component('prmAdvancedSearchAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmAdvancedSearchAfterController',
    template: '<md-button class="md-primary" ng-click="$ctrl.journalTitleSearch()" id="journal_title_search" aria-label="Journal Title Search">Journal Title Search</md-button>'
  });
  /*ends journal title search link to advanced search*/

    /*move the virtualBrowse section */
    app.factory('sectionOrdering', function() {
      return function (sections) {
        if(!sections) return false;
        
        var numSections = sections.length;
        if(!(numSections > 0)) return false;
  
        // Check if there is a 'virtualBrowse' section.
        //console.log("sectionOrdering: " + s.serviceName);
        var filterResult = sections.filter(function(s) {return s.serviceName === 'virtualBrowse';} );
        if(filterResult.length !== 1 ) return false;
        var browseSection = filterResult[0];
  
        var index = sections.indexOf(browseSection);
        
        // Remove the 'virtualBrowse' section from the array.
        sections.splice(index,1);
  
        // Insert the 'virtualBrowse' section to the array.
        sections.splice(3, 0, browseSection);
        
        
        return true;
      };
    });
    
    app.component('prmFullViewAfter', {
    bindings: { parentCtrl: '<' },
    controller: ['sectionOrdering', function(sectionOrdering) {
      //console.log("prmFullViewAfter called");
      var ctrl = this;

      ctrl.$onInit = function () {
        sectionOrdering(ctrl.parentCtrl.services);
        //console.log("ctrl.parentCtrl.services: " + ctrl.parentCtrl.services);
      };
      angular.element(document).ready(function () {
        //console.log("Virtual Browse (Click on cover for location info)");
	  	document.getElementById('virtualBrowse').getElementsByTagName("h4")[0].innerHTML = "Virtual Browse (Click on cover for location info)";
      });
      
      
    }]
  });
  /*end move the virtualBrowse section */


  /*add google analytics*/
  app.run(['$rootScope', '$location', '$window', function ($rootScope, $location, $window) {
    $window.ga('create', 'UA-4426028-9', 'auto');
    $rootScope.$on('$locationChangeSuccess', function (event) {
      $window.ga('send', 'pageview', { location: $location.url() });
    });
  }]);
  /*end add google anlytics*/

  /*add ILL link to Personal details*/

  app.component('prmLoansOverviewAfter', {
    bindings: { parentCtrl: '<' },
    template: '<a href="https://ill.lib.neu.edu/illiad/snell/illiad.dll?Action=10&Form=66" target="_blank" class="bold-text md-primoExplore-theme"><span> Access your ILLiad account</span><prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new" aria-label="Open in a new window"><md-icon md-svg-icon="primo-ui:open-in-new" aria-label="Open in a new window" class="md-primoExplore-theme" aria-hidden="true"><svg id="open-in-new" width="100%" height="100%" viewBox="0 0 24 24" y="504" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"></path></svg></md-icon></a>'
  });

  app.component('prmLoansAfter', {
    bindings: { parentCtrl: '<' },
    template: '<a href="https://ill.lib.neu.edu/illiad/snell/illiad.dll?Action=10&Form=66" target="_blank" class="bold-text md-primoExplore-theme"><span> Access your ILLiad account</span><prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new" aria-label="Open in a new window"><md-icon md-svg-icon="primo-ui:open-in-new" aria-label="Open in a new window" class="md-primoExplore-theme" aria-hidden="true"><svg id="open-in-new" width="100%" height="100%" viewBox="0 0 24 24" y="504" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"></path></svg></md-icon></a>'
  });

  /*ends add ILL link to Personal details*/

})();
