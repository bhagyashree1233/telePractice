angular.module('login',[])
.controller('loginCtrl',function($scope){
$scope.login={}
console.log('Hi am in Login controller')
$scope.loginValidate=function(){
console.log($scope.login);
}
})