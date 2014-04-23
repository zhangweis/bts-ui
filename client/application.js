define(['angular', 'angular-route', 'moment', 'transactions.js'], function (angular) {
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
    app.run(['$rootScope', function($rootScope){
        $rootScope.$apply($rootScope.appmenuOpened = false);
        $rootScope.toggleAppMenu = function () {
            console.log($rootScope.appmenuOpened);
            $rootScope.appmenuOpened = !$rootScope.appmenuOpened;
        }
    }]);
    app.controller("HeaderCtrl", ["$scope", function($scope) {
        $scope.isBarOpen = false;
    }]);
    app.controller("Transactions.Ctrl", ["$scope","$http", function($scope,$http) {
        $http.post('/rpc', {
            jsonrpc:'2.0',
            method:'openwallet',
            id:1,
            params:["i1d8zytQFxMF"]
        }).finally(function(result){
            $http.post('/rpc', {
                jsonrpc:'2.0',
                method:'getbalance',
                id:1,
                params:[]
            }).then(function(result){
                $scope.balance = (result.data.result.amount);
            });
        });
        //'uvSJlP9ilyYa'
    }]);
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

