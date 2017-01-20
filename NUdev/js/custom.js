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
})();
