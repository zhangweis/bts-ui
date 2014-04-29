define(['angular', 'angular-route','model/transaction','model/wallet'], function (angular) {
    var module = angular.module("transactions", ['ngRoute','model.transaction','model.wallet']);
    module.controller("TransactionsCtrl",['$scope','transactions',function ($scope,transactions) {
        $scope.transactionsLoading = true;
        transactions.getTransactions(function(err, data){
            $scope.transactions = data;
            $scope.transactionsLoading = false;
        });
    }]);
    module.controller("Transactions.Ctrl", ["$scope","wallet","$http", function($scope,wallet,$http) {
        wallet.openWallet().then(function(result){
            $http.post('/rpc', {
                jsonrpc:'2.0',
                method:'rescan',
                id:1,
                params:[]}).then(function(){
                    $http.post('/rpc', {
                        jsonrpc:'2.0',
                        method:'getbalance',
                        id:1,
                        params:[]
                    }).then(function(result){
                        $scope.balance = (result.data.result.amount);
                    });
                    $http.post('/rpc', {
                        jsonrpc:'2.0',
                        method:'get_transaction_history',
                        id:1,
                        params:[]
                    }).then(function(result){
                        console.log(result.data.result);
                    });
            });
        });
        //'uvSJlP9ilyYa'
    }]);
    return module;
});