define(['angular','model/wallet'],function(angular){
    var module = angular.module('model.transaction',['model.wallet']);
    module.factory('transactions', ["wallet","$http", function(wallet,$http) {
        return {
            getTransactions:function(cb){
                wallet.openWallet().then(function(result){
                        $http.post('/rpc', {
                            jsonrpc:'2.0',
                            method:'rescan',
                            id:1,
                            params:[]}).then(function(){
                                $http.post('/rpc', {
                                    jsonrpc:'2.0',
                                    method:'get_transaction_history',
                                    id:1,
                                    params:[]
                                }).then(function(result){
                                    // cb(null, [{
                                    //     address:'default',
                                    //     amount:0.1,
                                    //     confirmations:1,
                                    //     discoveredWhen:new Date(),
                                    //     type:'XTS'
                                    // },
                                    // {
                                    //     address:'default',
                                    //     amount:0.01,
                                    //     confirmations:2,
                                    //     discoveredWhen:new Date()-2000000,
                                    //     type:'XTS'
                                    // }]);
                                    var ret = [];
                                    angular.forEach(result.data.result, function(tx){
                                        var item = tx[1];
                                        item.discoveredWhen = new Date()-2000000;
                                        item.received = item.delta_balance[0][1]>0;
                                        item.delta = Math.abs(item.delta_balance[0][1]);
                                        ret.push(item);
                                    })
                                    console.log(result.data.result);
                                    cb(null,ret);
                                });
                        });
                    });
                    //'uvSJlP9ilyYa'
            }
        };
                }]);
                
    return module;
});