define(['angular', 'angular-route', 'moment', 'transactions.js'], function (angular) {
    var app = angular.module("webapp", ['ngRoute','transactions']);
    app.config(function ($routeProvider) {
        $routeProvider.when("/transactions", ({
            templateUrl: 'transactions.html', controller: 'TransactionsCtrl',
            controllerUrl: 'ctrl/transactions'
        }))
        .when("/send", ({
            templateUrl: 'send.html', controller: 'Send.Ctrl'
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
    app.controller("HeaderCtrl", ["$scope","$q", function($scope,$q) {
        $scope.isBarOpen = false;
    }]);
    var walletOpened = false;
    function openWallet($http, $q){
        var deferred = $q.defer();
        if (walletOpened)
            deferred.resolve('');
        else {
            $http.post('/rpc', {
                jsonrpc:'2.0',
                method:'openwallet',
                id:1,
                params:["i1d8zytQFxMF"]
            }).finally(function(result){
                    $http.post('/rpc', {
                        jsonrpc:'2.0',
                        method:'walletpassphrase',
                        id:1,
                        params:["uvSJlP9ilyYa"]
                    }).then(function() {
                        $http.post('/rpc', {
                            jsonrpc:'2.0',
                            method:'rescan',
                            id:1,
                            params:[]}).then(function(){
                                walletOpened=true;
                                deferred.resolve('');
                            });
                    });
            });
        }
        return deferred.promise;
    }
    app.controller("Send.Ctrl", ["$scope","$q","$http", function($scope,$q,$http) {
        $scope.address="MoLnLbfaE7itqD53snuY5Pw3HVAUD7gYc";
        $scope.amount=10;
        $scope.comment="";
        $scope.send=function(){
            openWallet($http,$q).then(function(result){
                    $http.post('/rpc', {
                        jsonrpc:'2.0',
                        method:'sendtoaddress',
                        id:1,
                        params:[$scope.address, {"amount":Number($scope.amount),"unit":0}, $scope.comment]
                    }).then(function(result){
                        $http.post('/rpc', {
                            jsonrpc:'2.0',
                            method:'rescan',
                            id:1,
                            params:[]});
                        alert('Sent. Balance should be changed.');
                    });
                });
        };
    }]);
    app.controller("Transactions.Ctrl", ["$scope","$q","$http", function($scope,$q,$http) {
        openWallet($http, $q).then(function(result){
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

