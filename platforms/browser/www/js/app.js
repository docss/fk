// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'ngStorage'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

   $ionicConfigProvider.tabs.position('bottom');
  $stateProvider

  /* .state('app', {
    url: '/app-fk',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
}) */
  /* .state('app.tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tab.html',
    controller: 'AppCtrl'
}) */
   .state('app', {
    url: '/app-fk',
    abstract: true,
    templateUrl: 'templates/tab.html',
    controller: 'AppCtrl'
   })
  .state('app.home', {
     url: '/home',
     cache: false,
     views: {
        'homeContent': {
           templateUrl: 'templates/home.html',
           controller: "HomeCtrl"
        }
     }
  })
  .state('app.partner', {
    url: '/partner?q',
    cache: false,
    views: {
      'partnerContent': {
        templateUrl: 'templates/partner.html',
        controller: "PartnerCtrl"
      }
    }
  })
  .state('app.favoriten', {
    cache: false,
    url: '/favoriten',
    views: {
      'favoritenContent': {
        templateUrl: 'templates/favoriten.html',
        controller: "FavoritenCtrl"
      }
    }
  })
  .state('app.distance', {
    cache: false,
    url: '/distance',
    views: {
      'distanceContent': {
        templateUrl: 'templates/distance.html',
        controller: "DistanceCtrl"
      }
    }
  })
  .state('app.user', {
    url: '/user/:userID',
    cache: false,
    views: {
      'userContent': {
        templateUrl: 'templates/user.html',
        controller: 'UserCtrl'
      }
    }
});

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app-fk/home');

});
