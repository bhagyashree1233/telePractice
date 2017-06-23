angular.module('global',[])
.controller('globalCtrl',function($rootScope,$scope){
    console.log('Hi am in global ctrl');
    $rootScope.showMainNavBar = true;
   
	$scope.tagline = 'Nothing beats a pocket protector!';
   // $rootScope.showMainNav = authentication.isLoggedIn();
    $rootScope.showMainNav = true;
    $rootScope.loadingImg = false;
})