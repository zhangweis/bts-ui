
'use strict';
require.config({
    baseUrl: "./",    
    paths: {
        'angular': 'bower_components/angular/angular.min',
        'angular-route': 'bower_components/angular-route/angular-route.min',
        'application':'application',
        'moment':'bower_components/moment/moment'
    },
    shim: {
        "angular": {
            exports: "angular"
        },
        "angular-route": {
            deps: ["angular"]
         }
	}
});

define([
  'angular',
  'application'
], function (angular, module) {
  angular.element(document).ready(function () {
    angular.bootstrap(document, [ module.name ])
  })
})
