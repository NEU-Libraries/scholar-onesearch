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
      template: '<md-button ng-click="$ctrl.worldcatPassthrough()" aria-label="Search Other Libraries">Search <img ng-src="custom/NUdev/img/worldcat-logo.png"/>Other Libraries</md-button>',
      bindings: {parentCtrl: '<'},
      controller: 'SearchBarAfterController',
    });

    app.controller('SearchBarAfterController', ['$window', function($window){
      var vm = this;
      vm.getQuery = getQuery;
      vm.worldcatPassthrough = worldcatPassthrough;

      function getQuery(){
        return vm.parentCtrl.mainSearchField;
      }

      function worldcatPassthrough(){
        var query = getQuery();
        $window.open("https://northeastern.on.worldcat.org/search?databaseList=638&queryString="+query);
      }

      angular.element(document).ready(function () {
        //this moves the element up to where advanced search is
        document.getElementsByClassName('search-elements-wrapper')[0].append(document.getElementsByTagName('prm-search-bar-after')[0]);
      });

      /*show tabs and scopes by default */
      vm.$onInit = function(){
        vm.parentCtrl.showTabsAndScopes = 1;
      }
      /*end show tabs and scopes by default */
    }]);
    /*end add worldcat passthrough*/


    /*make lib logo clickable*/
    app.controller('prmLogoAfterController', [function () {
    }]);

    app.component('prmLogoAfter',{
      bindings: {parentCtrl: '<'},
      controller: 'prmLogoAfterController',
      template: '<div class="product-logo product-logo-local" layout="row" layout-align="start center" layout-fill id="banner" tabindex="0" role="banner">' +
      '<a href="http://library.northeastern.edu">' +
      '<img class="logo-image" alt="{{::(&apos;nui.header.LogoAlt&apos; | translate)}}" ng-src="custom/NUdev/img/nu-libraries-logo.svg"/></a>' +
      '<a href="http://onesearch.northeastern.edu">' +
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
        if (!vm.prmActionCtrl.actionListService.actionsToIndex["report_a_problem"]) { // ensure we aren't duplicating the entry
          vm.prmActionCtrl.actionListService.requiredActionsList[8] = vm.prmActionCtrl.actionListService.requiredActionsList[7];
          vm.prmActionCtrl.actionListService.requiredActionsList[7] = vm.prmActionCtrl.actionListService.requiredActionsList[6];
          vm.prmActionCtrl.actionListService.requiredActionsList[6] = vm.prmActionCtrl.actionListService.requiredActionsList[5];
          vm.prmActionCtrl.actionListService.requiredActionsList[5] = vm.prmActionCtrl.actionListService.requiredActionsList[4];
          vm.prmActionCtrl.actionListService.requiredActionsList[4] = "report_a_problem";
          vm.prmActionCtrl.actionListService.actionsToDisplay.unshift("report_a_problem");
          vm.prmActionCtrl.actionListService.actionsToIndex["report_a_problem"] = 4;
        }
        //TODO - eventually change this to prod permalink - or retrieve permalink from somewhere else instead of manually writing it
        var url = "http://library.northeastern.edu/get-help/tech-support/report-a-problem?resource="+vm.prmActionCtrl.item.pnx.display.title[0]+" (http://northeastern-primostaging.hosted.exlibrisgroup.com/primo-explore/fulldisplay?"+encodeURIComponent("docid="+vm.prmActionCtrl.item.pnx.control.recordid+"&context=L&vid=NUdev&search_scope=new_everything_scope&tab=default_tab&lang=en_US")+")";
        vm.prmActionCtrl.onToggle["report_a_problem"] = function(){
          window.open(url, '_blank');
        };
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
        var index = vm.prmBriefResultCtrl.upFrontActionsService.requiredUpFrontActionsList.length;
        if (vm.prmBriefResultCtrl.upFrontActionsService.requiredUpFrontActionsList[index - 1] != "report_a_problem") { // ensure we aren't duplicating the entry
          vm.prmBriefResultCtrl.upFrontActionsService.requiredUpFrontActionsList[index] = "report_a_problem";
        }
        //TODO - eventually change this to prod permalink - or retrieve permalink from somewhere else instead of manually writing it
        var url = "http://library.northeastern.edu/get-help/tech-support/report-a-problem?resource="+vm.prmBriefResultCtrl.item.pnx.display.title[0]+" (http://northeastern-primostaging.hosted.exlibrisgroup.com/primo-explore/fulldisplay?"+encodeURIComponent("docid="+vm.prmBriefResultCtrl.item.pnx.control.recordid+"&context=L&vid=NUdev&search_scope=new_everything_scope&tab=default_tab&lang=en_US")+")";
        vm.prmBriefResultCtrl.openTab = function(e, t){
          e.stopPropagation();
          if (t == "report_a_problem"){
            window.open(url, '_blank');
          } else {
            this.openItemMenu(e);
            this.selectedAction = "none";
            this.$scope.$apply();
            this.selectedAction = t;
          }
        }
      };
    }]);
    app.component('prmBriefResultContainerAfter', {
      require: {
        prmBriefResultCtrl: '^prmBriefResultContainer',
      },
      controller: 'prmBriefResultContainerAfterController'
    });
    /*end add report a problem*/
})();
