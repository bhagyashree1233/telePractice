angular.module('telecom',['appRoutes','adminCtrl','services','login','global','ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		/*.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})
	
		.when('/home', {
			templateUrl: 'views/home.html'
		})
	
		.when('/services', {
			templateUrl: 'views/service.html'
		})

		.when('/nerds', {
			templateUrl: 'views/nerd.html',
			controller: 'NerdController'
		})

		.when('/geeks', {
			templateUrl: 'views/geek.html',
			controller: 'GeekController'	
		})
		.when('/signup', {
			templateUrl: 'views/signUp.html'	
		})
		.when('/contact', {
			templateUrl: 'views/contactUs.html'	
		})
		.when('/about', {
			templateUrl: 'views/about.html'
		})
    
        

        .when('/login', {
			templateUrl: 'views/login.html'	
		})
	*/
  		.when('/admin', {
			templateUrl: 'views/admin.html',
			controller: 'adminCtrl'	
		})
        .when('/login', {
			templateUrl: 'views/login.html'	,
            
		}) 
/*
		.when('/mdealer', {
			templateUrl: 'views/masterDealer.html',
			controller: 'mDealerMainCtrl'	
		})

		.when('/dealer', {
			templateUrl: 'views/dealer.html',
			controller: 'dealerMainCtrl'	
		})

		.when('/retailer', {
			templateUrl: 'views/retailer.html',
			controller: 'retailerMainCtrl'		
		})
		*/
	$locationProvider.html5Mode(true);

}])