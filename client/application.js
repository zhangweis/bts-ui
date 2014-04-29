define(['angular', 'angular-route', 'moment', 'transactions.js', 'model/wallet'], function (angular) {
    var app = angular.module("webapp", ['ngRoute','transactions', 'model.wallet']);
    app.config(function ($routeProvider) {
        $routeProvider.when("/transactions", ({
            templateUrl: 'transactions.html', controller: 'TransactionsCtrl',
            controllerUrl: 'ctrl/transactions'
        }))
        .when("/send", ({
            templateUrl: 'send.html', controller: 'Send.Ctrl'
        }))
        .when("/receive", ({
            templateUrl: 'receive.html', controller: 'Receive.Ctrl'
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
    app.controller("Send.Ctrl", ["$scope","wallet","$http", function($scope,wallet,$http) {
        $scope.address="MoLnLbfaE7itqD53snuY5Pw3HVAUD7gYc";
        $scope.amount=10;
        $scope.comment="";
        $scope.send=function(){
            wallet.openWallet().then(function(result){
                $http.post('/rpc', {
                    jsonrpc:'2.0',
                    method:'walletpassphrase',
                    id:1,
                    params:["uvSJlP9ilyYa",3]
                }).then(function() {
                    $http.post('/rpc', {
                        jsonrpc:'2.0',
                        method:'sendtoaddress',
                        id:1,
                        params:[$scope.address, Number($scope.amount), $scope.comment]
                    }).then(function(result){
                        $http.post('/rpc', {
                            jsonrpc:'2.0',
                            method:'rescan',
                            id:1,
                            params:[]});
                        alert('Sent. Balance should be changed.');
                    }, function(result){
                        alert(result.data.error.message)
                    });
                });
            });
        };
    }]);
    app.controller("Receive.Ctrl", ["$scope","wallet","$http", function($scope,wallet,$http) {
        wallet.openWallet().then(function(result){
            $http.post('/rpc', {
                jsonrpc:'2.0',
                method:'listrecvaddresses',
                id:1,
                params:[]
            }).then(function(result){
                $scope.addresses = (result.data.result);
            });
        });
//          $scope.addresses=['addr1','addr2'];
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

