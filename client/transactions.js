define(['angular', 'angular-route','model/transaction'], function (angular) {
    var module = angular.module("transactions", ['ngRoute','model.transaction']);
    module.controller("TransactionsCtrl",['$scope','transactions',function ($scope,transactions) {
        $scope.transactions = transactions.getTransactions();
    }]);
    return module;
});