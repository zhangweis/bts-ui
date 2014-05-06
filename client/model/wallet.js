define(['angular'],function(angular){
    var module = angular.module('model.wallet',[]);
    var walletOpened = false;
    module.factory('wallet', ['$http','$q',function($http,$q){
        function unlockWallet(unlockPassword){
            var deferred = $q.defer();
            openWallet().then(function(result){
                $http.post('/rpc', {
                    jsonrpc:'2.0',
                    method:'walletpassphrase',
                    id:1,
                    params:[unlockPassword,3]
                }).then(function() {
                        deferred.resolve('');
                }, function(err,result){
                    deferred.reject('Wrong password to unlock wallet for sending.['+err.data.error.message+']');
                });
            });
            return deferred.promise;
        }
        function openWallet(unlockPassword){
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
            openWallet:openWallet,
            unlockWallet:unlockWallet
        };
    }]);
    return module;
});