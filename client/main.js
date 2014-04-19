
'use strict';
require.config({
    baseUrl: "./bower_components/",    
    paths: {
        'angular': 'angular/angular',
        'angularAMD': 'angularAMD/angularAMD',
        'angular-route': 'angular-route/angular-route',
	'application':'../application'
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
