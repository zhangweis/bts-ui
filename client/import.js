define(['angular','model/wallet'], function(angular){
   var module = angular.module('import', ['model.wallet']);
    module.config(function ($routeProvider) {
        $routeProvider.when("/import", ({
            templateUrl: 'import.html', controller: 'ImportCtrl',
            controllerUrl: 'ctrl/import'
        }));
    });
   module.controller('ImportCtrl', ['$scope','$http','growl','wallet',function($scope,$http,growl,wallet){
       $scope.import=function() {
            if ($scope.privateKey) {
                wallet.unlockWallet('hellozw75').then(function(){
                    $http.post('/rpc', {
                        jsonrpc:'2.0',
                        method:'import_private_key',
                        id:1,
                        params:[$scope.privateKey,$scope.label]}).then(function(){
                        growl.addSuccessMessage('Imported successfully.')
                        $scope.privateKey="";
                        $scope.label="";
                    }, function(result){
                        growl.addErrorMessage('Import failed because of \n'+result.data.error.message)
                    });
                }, function(result){
                     growl.addErrorMessage(result)
                 });
            }
           console.log($scope.walletPassword);
       }
   }]);
   return module;
});