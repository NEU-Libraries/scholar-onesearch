(function () {
    "use strict";
    'use strict';


    var app = angular.module('viewCustom', ['angularLoad']);

    /****************************************************************************************************/

        /*In case of CENTRAL_PACKAGE - comment out the below line to replace the other module definition*/

        /*var app = angular.module('centralCustom', ['angularLoad']);*/

    /****************************************************************************************************/


    /*make lib logo clickable*/
    app.controller('prmLogoAfterController', [function () {
      // var vm = this;
      // vm.getIconLink = getIconLink;
      // function getIconLink() {
      //   return vm.parentCtrl.iconLink;
      // }
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
