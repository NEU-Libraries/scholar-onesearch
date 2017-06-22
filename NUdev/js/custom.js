(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

(function () {
    "use strict";
    'use strict';

    //need to figure out how to pass in view code instead of hardcoding to NUdev for image path

    var app = angular.module('viewCustom', ['angularLoad']);

    /****************************************************************************************************/

        /*In case of CENTRAL_PACKAGE - comment out the below line to replace the other module definition*/

        /*var app = angular.module('centralCustom', ['angularLoad']);*/

    /****************************************************************************************************/


    /*add worldcat passthrough*/
    app.component('prmSearchBarAfter', {
      bindings: {parentCtrl: '<'},
      controller: 'SearchBarAfterController',
    });
    app.controller('SearchBarAfterController', ['$scope', function($scope){
      var vm = this;
      angular.element(document).ready(function () {
        vm.parentCtrl.showTabsAndScopes = 1;
        var node = document.getElementById('worldcat-button');
        if (node){
          document.getElementsByClassName('search-elements-wrapper')[0].append(node);
          if (!node.classList.contains("hide-sm")){
            node.className += " hide-sm";
          }
        }
        var mobile_node = document.getElementById('worldcat-mobile-button');
        if (mobile_node){
          document.getElementsByClassName('search-actions')[0].prepend(mobile_node);
          if (!mobile_node.classList.contains("hide-gt-sm")){
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
      template: '<md-button ng-click="$ctrl.worldcatPassthrough()" id="worldcat-button" aria-label="Search Other Libraries">Search <img ng-src="custom/NUdev/img/worldcat-logo.png"/>Other Libraries</md-button><md-button ng-click="$ctrl.worldcatPassthrough()" id="worldcat-mobile-button" aria-label="Search Other Libraries"> <img ng-src="custom/NUdev/img/worldcat-logo.png"/> </md-button>',
      bindings: {parentCtrl: '<'},
      controller: 'SearchAfterController',
    });

    app.controller('SearchAfterController', ['$window', function($window){
      var vm = this;
      vm.getQuery = getQuery;
      vm.worldcatPassthrough = worldcatPassthrough;

      function getQuery(){
        return vm.parentCtrl.searchFieldsService._mainSearch;
      }

      function worldcatPassthrough(){
        var query = getQuery();
        $window.open("https://northeastern.on.worldcat.org/search?databaseList=638&queryString="+query);
      }

      if (vm.parentCtrl.isSearchDone() == true && document.getElementsByTagName('primo-explore')[0].classList.contains("__gt-sm")){
        document.getElementById('worldcat-button').classList.add("show-md"); // = 'block';
        document.getElementById('worldcat-button').classList.remove("hide");
      } else if (vm.parentCtrl.isSearchDone() != true) {
        document.getElementById('worldcat-button').classList.add("hide");
      }

      /*show tabs and scopes by default */
      vm.$onInit = function(){
        vm.parentCtrl.showTabsAndScopes = 1;
        if (!document.getElementById('worldcat-mobile-button').classList.contains("hide-gt-sm")){
          document.getElementById('worldcat-mobile-button').className += " hide-gt-sm";
        }
        if (!document.getElementById('worldcat-button').classList.contains("hide-sm")){
          document.getElementById('worldcat-button').className += " hide-sm";
        }
        document.getElementsByTagName('prm-search-after')[0].classList.add("hide"); //hide the prm-search-after since we move the buttons out of it for display
      }
      /*end show tabs and scopes by default */
    }]);
    /*end add worldcat passthrough*/


    /*make lib logo clickable*/
    app.controller('prmLogoAfterController', ['$scope', '$window', function ($scope, $window) {
      var vm = this;
      vm.getView = getView;

      function getView(){
        return $window.appConfig.vid
      }
    }]);

    app.component('prmLogoAfter',{
      bindings: {parentCtrl: '<'},
      controller: 'prmLogoAfterController',
      template: '<div class="product-logo product-logo-local" layout="row" layout-align="start center" layout-fill id="banner" tabindex="0" role="banner">' +
      '<a href="http://library.northeastern.edu">' +
      '<img class="logo-image" alt="{{::(&apos;nui.header.LogoAlt&apos; | translate)}}" ng-src="custom/NUdev/img/nu-libraries-logo.svg"/></a>' +
      '<a href="/primo-explore/?vid={{$ctrl.getView()}}">' +
      '<img class="logo-image sos" alt="{{::(&apos;nui.header.LogoAlt&apos; | translate)}}" ng-src="custom/NUdev/img/sosbold.svg"/></a></div>'
    });
    /*end make lib logo clickable*/

    /*add report a problem*/
    app.controller('prmActionListAfterController', ['$scope', function($scope) {
      var vm = this;
      vm.$onInit = function() {
        vm.prmActionCtrl.actionLabelNamesMap["report_a_problem"] = "Report a Problem";
        vm.prmActionCtrl.actionIconNamesMap["report_a_problem"] = "report_a_problem";
        vm.prmActionCtrl.actionIcons["report_a_problem"] = {
          icon: "ic_announcement_24px",
          iconSet: "action",
          type: "svg"
        };
        //TODO - what about if something gets added to this list - may need to refactor for loop
        if (!vm.prmActionCtrl.actionListService.actionsToIndex["report_a_problem"]) { // ensure we aren't duplicating the entry
          //vm.prmActionCtrl.actionListService.requiredActionsList[8] = vm.prmActionCtrl.actionListService.requiredActionsList[7];
          //vm.prmActionCtrl.actionListService.requiredActionsList[7] = vm.prmActionCtrl.actionListService.requiredActionsList[6];
          //vm.prmActionCtrl.actionListService.requiredActionsList[6] = vm.prmActionCtrl.actionListService.requiredActionsList[5];
          //vm.prmActionCtrl.actionListService.requiredActionsList[5] = vm.prmActionCtrl.actionListService.requiredActionsList[4];
          vm.prmActionCtrl.actionListService.requiredActionsList[8] = "report_a_problem";
          vm.prmActionCtrl.actionListService.actionsToDisplay.unshift("report_a_problem");
          vm.prmActionCtrl.actionListService.actionsToIndex["report_a_problem"] = 8;
        }
        if (vm.prmActionCtrl.$state.$current.locals.globals.$stateParams.vid == "NU") { //if using prod view, use prod links
          var url = "http://library.northeastern.edu/get-help/tech-support/report-a-problem?resource="+vm.prmActionCtrl.item.pnx.display.title[0]+" (http://northeastern-primo.hosted.exlibrisgroup.com/primo-explore/fulldisplay?"+encodeURIComponent("docid="+vm.prmActionCtrl.item.pnx.control.recordid+"&context=L&vid=NUdev&search_scope=new_everything_scope&tab=default_tab&lang=en_US")+")";
        } else { //not prod view, don't use prod links
          var url = "http://librarydev.neu.edu/get-help/tech-support/report-a-problem?resource="+vm.prmActionCtrl.item.pnx.display.title[0]+" (http://northeastern-primostaging.hosted.exlibrisgroup.com/primo-explore/fulldisplay?"+encodeURIComponent("docid="+vm.prmActionCtrl.item.pnx.control.recordid+"&context=L&vid=NUdev&search_scope=new_everything_scope&tab=default_tab&lang=en_US")+")";
        }
        if (vm.prmActionCtrl.actionListService.onToggle){
          vm.prmActionCtrl.actionListService.onToggle["report_a_problem"] = function(){
            window.open(url, '_blank');
          };
        }
        if (vm.prmActionCtrl.onToggle){
          vm.prmActionCtrl.onToggle["report_a_problem"] = function(){
            window.open(url, '_blank');
          };
        }


    };
    }]);
    app.component('prmActionListAfter', {
      require: {
        prmActionCtrl: '^prmActionList',
      },
      controller: 'prmActionListAfterController',
    });


    app.controller('prmBriefResultContainerAfterController', ['$scope', function($scope){
      var vm = this;
      vm.$onInit = function() {
        vm.prmBriefResultCtrl.upFrontActionsService.actionIconNamesMap["report_a_problem"] = "report_a_problem";
        vm.prmBriefResultCtrl.upFrontActionsService.actionLabelNamesMap["report_a_problem"] = "Report a Problem";
        vm.prmBriefResultCtrl.actionsIcons["report_a_problem"] = {
          icon: "ic_announcement_24px",
          iconSet: "action",
          type: "svg"
        };
        //TODO - what about if something gets added to this list - may need to refactor for loop
        var index = vm.prmBriefResultCtrl.upFrontActionsService.requiredUpFrontActionsList.length;
        if (vm.prmBriefResultCtrl.upFrontActionsService.requiredUpFrontActionsList[0] != "report_a_problem") { // ensure we aren't duplicating the entry
          if (index > 1){
              vm.prmBriefResultCtrl.upFrontActionsService.requiredUpFrontActionsList[index - (index -2)] = vm.prmBriefResultCtrl.upFrontActionsService.requiredUpFrontActionsList[1]
          }
          vm.prmBriefResultCtrl.upFrontActionsService.requiredUpFrontActionsList[index - (index -1)] = vm.prmBriefResultCtrl.upFrontActionsService.requiredUpFrontActionsList[0]
          vm.prmBriefResultCtrl.upFrontActionsService.requiredUpFrontActionsList[0] = "report_a_problem";
        }
        if (vm.prmBriefResultCtrl.searchService.vid == "NU") { //if using prod view, use prod links
          var url = "http://library.northeastern.edu/get-help/tech-support/report-a-problem?resource="+vm.prmBriefResultCtrl.item.pnx.display.title[0]+" (http://northeastern-primo.hosted.exlibrisgroup.com/primo-explore/fulldisplay?"+encodeURIComponent("docid="+vm.prmBriefResultCtrl.item.pnx.control.recordid+"&context=L&vid=NUdev&search_scope=new_everything_scope&tab=default_tab&lang=en_US")+")";
        } else { //not prod view, don't use prod links
          var url = "http://librarydev.neu.edu/get-help/tech-support/report-a-problem?resource="+vm.prmBriefResultCtrl.item.pnx.display.title[0]+" (http://northeastern-primostaging.hosted.exlibrisgroup.com/primo-explore/fulldisplay?"+encodeURIComponent("docid="+vm.prmBriefResultCtrl.item.pnx.control.recordid+"&context=L&vid=NUdev&search_scope=new_everything_scope&tab=default_tab&lang=en_US")+")";
        }
        vm.prmBriefResultCtrl.openTab = function(e, t){
          e.stopPropagation();
          if (t == "report_a_problem"){
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
        prmBriefResultCtrl: '^prmBriefResultContainer',
      },
      controller: 'prmBriefResultContainerAfterController'
    });
    /*end add report a problem*/

    /*add proquest account id for service link*/
    app.controller('prmServiceLinksAfterController', ['$scope', function($scope){
      var vm = this;
      vm.$onInit = function() {
        angular.forEach(vm.prmServiceLinksCtrl.recordLinks, function(value, key){
          if (value.linkURL.indexOf("search.proquest.com") >= 0){
            value.linkURL = value.linkURL + "?accountid=12826";
          }
        });
      };
    }]);
    app.component('prmServiceLinksAfter', {
      require: {
        prmServiceLinksCtrl: '^prmServiceLinks',
      },
      controller: 'prmServiceLinksAfterController'
    });
    /*ends add proquest account id for service link*/

    /*add journal title search link to advanced search*/
    app.controller('prmAdvancedSearchAfterController', ['$window', function($window){
      var vm = this;
      vm.journalTitleSearch = journalTitleSearch;
      angular.element(document).ready(function () {
        var node = document.getElementById("journal_title_search");
        document.getElementsByTagName('prm-advanced-search')[0].children[0].children[0].children[1].children[1].append(node);
      });

      function journalTitleSearch(){
        var node = document.getElementById("journal_title_search");
        if (node.textContent == "Journal Title Search"){
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
      bindings: {parentCtrl: '<'},
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

      // Check if there is a 'details' section.
      var filterResult = sections.filter(function(s) {return s.serviceName === 'virtualBrowse';} );
      if(filterResult.length !== 1 ) return false;
      var detailsSection = filterResult[0];

      var index = sections.indexOf(detailsSection);
      
      // Remove the 'virtualBrowse' section from the array.
      sections.splice(index,1);

      // Insert the 'virtualBrowse' section to the array.
      sections.splice(3, 0, detailsSection);
      
      return true;
    };
  });
    app.component('prmFullViewAfter', {
    bindings: {
      parentCtrl: '<',
    },
    controller: ['sectionOrdering', function(sectionOrdering) {
      var ctrl = this;

      ctrl.$onInit = function () {
        sectionOrdering(ctrl.parentCtrl.services);
      };

    }]
  });
  /*end move the virtualBrowse section */

    /*add google analytics*/
    app.run(['$rootScope', '$location', '$window', function($rootScope, $location, $window){
      $window.ga('create', 'UA-4426028-9', 'auto');
      $rootScope.$on('$locationChangeSuccess', function(event){
        $window.ga('send', 'pageview', {location: $location.url()});
      });
    }]);
    /*end add google anlytics*/
})();
