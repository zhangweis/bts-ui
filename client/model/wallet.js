define(['angular'],function(angular){
    var module = angular.module('model.wallet',[]);
    var walletOpened = false;
    module.factory('wallet', ['$http','$q',function($http,$q){
        function openWallet(){
            var deferred = $q.defer();
            if (walletOpened)
                deferred.resolve('');
            else {
                $http.post('/rpc', {
                    jsonrpc:'2.0',
                    method:'open_wallet',
                    id:1,
                    params:["default",""]
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
            }
            return deferred.promise;
        }
        return {
            openWallet:openWallet
        };
    }]);
    return module;
});