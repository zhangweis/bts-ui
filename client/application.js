define(['angular', 'angular-route', 'moment', 'transactions.js', 'model/wallet','angular-growl', './import'], function (angular) {
    var app = angular.module("webapp", ['ngRoute','transactions', 'model.wallet','angular-growl', 'import']);
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
    app.config(['growlProvider', function(growlProvider) {
        growlProvider.globalTimeToLive(5000);
    }]);
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
    app.controller("Send.Ctrl", ["$scope","wallet","$http",'growl', function($scope,wallet,$http,growl) {
        $scope.address="MoLnLbfaE7itqD53snuY5Pw3HVAUD7gYc";
        $scope.amount=10;
        $scope.comment="";
        $scope.send=function(){
            wallet.unlockWallet("uvSJlP9ilyYa")
                .then(function() {
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
                        growl.addErrorMessage(result.data.error.message)
                    });
                }, function(result){
                    //alert(result.data.error.message)
                    growl.addErrorMessage('Wrong password to unlock wallet for sending.'+result)
                });
        };
    }]);
    app.controller("Receive.Ctrl", ["$scope","wallet","$http", function($scope,wallet,$http) {
        wallet.openWallet().then(function(result){
            $http.post('/rpc', {
                jsonrpc:'2.0',
                method:'list_receive_addresses',
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

