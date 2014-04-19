
'use strict';

// Dynamically determine test spec files
var tests = Object.keys(window['__karma__'].files).filter(function (file) {
  return (/^\/base\/client\/.*spec\.js$/).test(file)
}).map(function (file) {
  return file.replace(/^\/base\/client\//, '').replace(/\.js$/, '')
})

// Configure test harness dependency list
var deps = ['es5', 'json3', 'modernizr', 'jquery'].concat(tests)

// Configuration for unit testing
require.config({
  baseUrl: '/base/client',
  callback: window['__karma__'].start,
  deps: deps,
  paths: {
    angular: '../bower_components/angular/angular',
    angularMocks: '../bower_components/angular-mocks/angular-mocks',
    es5: '../bower_components/es5-shim/es5-shim',
    jquery: '../bower_components/jquery/jquery',
    json3: '../bower_components/json3/lib/json3',
    modernizr: '../bower_components/modernizr/modernizr',
    text: '../bower_components/text/text',
    underscore: '../bower_components/underscore/underscore'
  },
  priority: [
    'angular'
  ],
  shim: {
    angular: {
      exports: 'angular'
    },
    angularMocks: {
      deps: [
        'angular'
      ],
      exports: 'angular.mock'
    }
  }
})
