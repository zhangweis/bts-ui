define(['angular', 'angular-route', 'moment/moment', 'transactions.js'], function (angular) {
    var app = angular.module("webapp", ['ngRoute','transactions']);
    app.config(function ($routeProvider) {
        $routeProvider.when("/transactions", ({
            templateUrl: 'transactions.html', controller: 'TransactionsCtrl',
            controllerUrl: 'ctrl/transactions'
        }))
        .when("/send", ({
            templateUrl: 'send.html'
        }))
        .otherwise({
          redirectTo: '/transactions'
        });
    });
    app.filter('timeago', function(){
        return function(date){
            return moment(date).fromNow();
        };
    });
    app.directive('timeago', function() {
        return {
            restrict:'A',
            link: function(scope, element, attrs){
                attrs.$observe("timeago", function(){
                    element.text(moment(attrs.timeago).fromNow());
                });
            }
        };
    });
    return app;
});

