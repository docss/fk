angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout, PartnerFactory, FilterFactory) {

  	/* $scope.filterData 	= {}; */

	/* $ionicModal.fromTemplateUrl('templates/modal.filter.html', {
	    scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.closeFilter = function() {
	    $scope.modal.hide();
	}; */

   /*
	$scope.filter = function() {
		FilterFactory.orte().then( function(response) {
			$scope.orte = response;

		});
		FilterFactory.branchen().then( function(response) {
			$scope.branchen = response;

		});
	    $scope.modal.show();
	}; */

   /*
	$scope.doFilter = function() {
		$scope.filterData.action = "list";
	    console.log($scope.filterData);
	    $scope.hasError = false;
		PartnerFactory.filter( $scope.filterData ).then( function( response ) {

			$rootScope.partners = response;
	    	console.log( response );
	    	// console.log( response.data.error );
	    	$timeout(function() {
	      		$scope.closeFilter();
	    	}, 1000);

		}).catch( function(response) {

		});

  }; // doFilter
  */

})

/* ------------------------------------------------------------------------------------------------------------------------------------------- */
/* PARTNER LIST; SEARCH; FILTER */
.controller("PartnerCtrl", function($scope, $rootScope, $timeout, FilterFactory, PartnerFactory) {

   $rootScope.partners     = [];
   $scope.page             = 0;
   $scope.filterData       = {};
   $scope.moreDataCanBeLoaded = function() {return true;};
   // $rootScope.filterDataOrt 	= "";
   // Fill Filters
   FilterFactory.orte().then( function(response) {
      $scope.orte = response;
   });
   FilterFactory.branchen().then( function(response) {
      $scope.branchen = response;
   });

   $scope.loadMore = function( filterActive = 0 ) {
      /*
         filterActive setzt beim Benutzen der Filter (inkl. "Alle") Ergebnisse und Page zurueck
      */
      if( filterActive == 1 ) {
         $rootScope.partners = [];
         $scope.page = 0;
      }
      PartnerFactory.all( $scope.page, $scope.filterData ).then(function( response ){
         $rootScope.partners = $rootScope.partners.concat(response.data);
         $rootScope.partners.push(response.data);
         if( response.data.length > 9 ) {
            $scope.$broadcast('scroll.infiniteScrollComplete');
         } else {
            $scope.moreDataCanBeLoaded = function() {return false;};
         }
         $scope.page += 1;
      }).catch(function(response){
      });

  };



})

/* ------------------------------------------------------------------------------------------------------------------------------------------- */
/* Favoriten */
.controller("FavoritenCtrl", function( $scope, $rootScope, StorageService, PartnerFactory ) {

   $rootScope.favoriten     = [];
   $scope.page             = 0;
   $scope.myFavs           = StorageService.getAll();
   $scope.moreDataCanBeLoaded = function() {return true;};
   $rootScope.error        = false;

   $scope.loadMore = function( filterActive = 0 ) {
      /*
         filterActive setzt beim Benutzen der Filter (inkl. "Alle") Ergebnisse und Page zurueck
      */
      if( filterActive == 1 ) {
         $rootScope.favoriten = [];
         $scope.page = 0;
      }
      PartnerFactory.favoriten( $scope.page, $scope.myFavs ).then(function( response ) {
         if( response.data.error ) $rootScope.error = response.data.error;
         $rootScope.favoriten = $rootScope.favoriten.concat(response.data);
         $rootScope.favoriten.push(response.data);

         // console.log( response.data.length );
         $scope.$broadcast('scroll.infiniteScrollComplete');
         if( response.data.length > 9 ) {



         } else {
            // $scope.showOrHide = function() {return true;}
            $scope.moreDataCanBeLoaded = function() {return false;};
         }
         $scope.page += 1;
      }).catch(function(response){
      });

  };

})

/* ------------------------------------------------------------------------------------------------------------------------------------------- */
/* ... */
.controller("UserCtrl", function($scope, $state, PartnerFactory, $cordovaGeolocation, StorageService) {

   PartnerFactory.single().then(function(response){

      $scope.user = response.data;
      // console.log( $scope.user.ID );
      console.log("isFav: " + StorageService.get($scope.user.ID) );
      if( StorageService.get($scope.user.ID) >= 0 ) $scope.isFav = true;
      else $scope.isFav = false;

	}).catch(function(response){
	});



   $scope.setFav = function( action, id ) {
      console.log( "Dealing..." );
      if( action == "set" ) {
         StorageService.add(id);
         console.log( "SET: " + StorageService.get(id) );
         $scope.isFav = true;
      } else {
         StorageService.remove(id);
         console.log( "REMOVE: " + StorageService.get(id) );
         $scope.isFav = false;
      }
      // window.location.reload();
   }

   /* ------------------------------------------------------------------------- */
   // Google Maps


   /* ------------------------------------------------------------------------- */
   // DISTANCE
   function distance(lat1, lon1, lat2, lon2, unit) {
   	var radlat1 = Math.PI * lat1/180
   	var radlat2 = Math.PI * lat2/180
   	var theta = lon1-lon2
   	var radtheta = Math.PI * theta/180
   	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
   	dist = Math.acos(dist)
   	dist = dist * 180/Math.PI
   	dist = dist * 60 * 1.1515
   	if (unit=="K") { dist = dist * 1.609344 }
   	if (unit=="N") { dist = dist * 0.8684 }
   	return dist
   }

   /* ------------------------------------------------------------------------- */
   // GET LOCATION (ONE TIME)
   /* function getMyLocation() {

      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      var lat, long;
      // $scope.myLocation = "...";
      $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
         // lat  = position.coords.latitude;
         // long = position.coords.longitude;
         // $scope.myLocation =  position.coords.latitude + " " + position.coords.longitude;
       }, function(err) {
         // error
         alert("error");
       });

   } */

   /* ------------------------------------------------------------------------- */
   // WATCH LOCATION
   /* function watchMyLocation() {

      var watchOptions = {
         timeout : 10000,
         maximumAge: 5000,
         enableHighAccuracy: true
      };

     var watch = $cordovaGeolocation.watchPosition(watchOptions);
     watch.then(
       null,
       function(err) {
       }, function(position) {
         $scope.myLocation =  position.coords.latitude + " - " + position.coords.longitude;
         $scope.myDistance = "Distanz: " + Math.round10( distance(position.coords.latitude, position.coords.longitude, $scope.user.lat, $scope.user.long, "K"), -2 ) + " km";
     });
     //watch.clearWatch();
   }

   watchMyLocation(); */

})

/* ------------------------------------------------------------------------------------------------------------------------------------------- */
/* ... */
/*
.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})
.controller('PlaylistCtrl', function($scope, $stateParams) {
}); */
