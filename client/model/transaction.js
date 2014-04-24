define(['angular'],function(angular){
    var module = angular.module('model.transaction',[]);
    module.factory('transactions', [function(){
        return {
            getTransactions:function(){
                return [{
                    address:'default',
                    amount:0.1,
                    confirmations:1,
                    discoveredWhen:new Date(),
                    type:'XTS'
                },
                {
                    address:'default',
                    amount:0.01,
                    confirmations:2,
                    discoveredWhen:new Date()-2000000,
                    type:'XTS'
                }];
            }
        }
    }]);
    return module;
});