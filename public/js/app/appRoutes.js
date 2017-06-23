angular.module('appRoutes', [])

.run(function($rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
	   console.log('Started');
	  if (authentication.isLoggedIn()) {
	//	  console.log('entered logged in already');
		   $location.path(authentication.currentUser().locationUrl);
      }
	  
      if (($location.path() === '/mdealer' || $location.path() === '/dealer' || $location.path() === '/retailer'|| $location.path() === '/admin') && !authentication.isLoggedIn()) {
         //  $rootScope.showMainNav = true;
		   $location.path('/login');
      } 
	  if($location.path() === '/mdealer' || $location.path() === '/dealer' || $location.path() === '/retailer'|| $location.path() === '/admin') {
		   $rootScope.showMainNav = false;
	  } else {
		   $rootScope.showMainNav = true;
	  }
    });
  })


/*.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

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
    
        .when('/', {
			templateUrl: 'views/login.html'	
		}) 

        .when('/login', {
			templateUrl: 'views/login.html'	
		})
	
  		.when('/admin', {
			templateUrl: 'views/admin.html',
			controller: 'adminCtrl'	
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
		
	$locationProvider.html5Mode(true);

}]); */