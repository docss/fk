angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout, PartnerFactory, FilterFactory) {
})

/* ------------------------------------------------------------------------------------------------------------------------------------------- */
/* PARTNER LIST; SEARCH; FILTER */
.controller("HomeCtrl", function($scope, $rootScope, $timeout, $http, PartnerFactory, $location, $state) {

   $scope.search = {};
   $scope.Search = function() {
      if( $scope.search.term ) {
         $state.go('app.partner', {"q": $scope.search.term});
      }
   }

   // sponsored;
   $scope.nosponsores = true;
   PartnerFactory.sponsored().then(function(response){
      if( response.data.error ) {
         $scope.nosponsores = true;
      } else {
         $scope.nosponsores = false;
      }
      $scope.sponsored = response.data;
	}).catch(function(response){
	});

   $scope.RedirectPartner = function(id) {
      $state.go("app.user", {"userID": id})
   };

   $rootScope.newestPartners     = [];
   PartnerFactory.newest( 5 ).then(function( response ){
      $rootScope.newestPartners = $rootScope.newestPartners.concat(response.data);
      $rootScope.newestPartners.push(response.data);
      if( response.data.length > 9 ) {
         // $scope.$broadcast('scroll.infiniteScrollComplete');
      } else {
         $scope.moreDataCanBeLoaded = function() {return false;};
      }
      $scope.spinninghide = true;
   }).catch(function(response){
      $scope.spinninghide = true;
   });


})

/* ------------------------------------------------------------------------------------------------------------------------------------------- */
/* PARTNER LIST; SEARCH; FILTER */
.controller("PartnerCtrl", function($scope, $rootScope, $timeout, FilterFactory, PartnerFactory, $stateParams) {

   $rootScope.partners     = [];
   $scope.page             = 0;
   $scope.filterData       = {};

   $scope.no_results = true;

   if( $stateParams.q ) {
      $scope.filterData = {};
      $scope.filterData = {"q":$stateParams.q};
   }

   $scope.moreDataCanBeLoaded = function() {return true;};

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
         $scope.spinninghide = true;
         if( response.data.error ) {
            $scope.no_results = false;
         } else {
            $scope.no_results = true;
         }

      }).catch(function(response){
         $scope.spinninghide = true;
      });

  };

  $scope.Filtering = function() {
     // alert("fdf");
     $scope.loadMore(1);
 }



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
         $scope.$broadcast('scroll.infiniteScrollComplete');
         if( response.data.length > 9 ) {
         } else {
            $scope.moreDataCanBeLoaded = function() {return false;};
         }
         $scope.page += 1;
         $scope.spinninghide = true;
      }).catch(function(response){
         $scope.spinninghide = true;
      });

  };

})

/* ------------------------------------------------------------------------------------------------------------------------------------------- */
/* ... */
.controller("UserCtrl", function($scope, $state, PartnerFactory, $cordovaGeolocation, StorageService) {

   PartnerFactory.single().then(function(response){

      $scope.user = response.data;
      // console.log( $scope.user.id );
      console.log("isFav: " + StorageService.get($scope.user.ID) );
      if( StorageService.get($scope.user.ID) >= 0 ) $scope.isFav = true;
      else $scope.isFav = false;

      $scope.spinninghide = true;

	}).catch(function(response){

      $scope.spinninghide = true;

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

})

/* ------------------------------------------------------------------------------------------------------------------------------------------- */
/* IN DER NAEHE */
.controller("DistanceCtrl", function($scope, $rootScope, $state, FilterFactory, PartnerFactory, $stateParams, $cordovaGeolocation) {

   $rootScope.partners     = [];
   $scope.page             = 0;
   $scope.filterData       = {};

   $scope.no_results = true;

   $scope.moreDataCanBeLoaded = function() {return true;};

   var posOptions = {timeout: 10000, enableHighAccuracy: false};
   var lat, long;
   // $scope.myLocation = "...";
   $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {

      $scope.loadMore = function( filterActive = 0 ) {

         if( filterActive == 1 ) {
            $rootScope.partners = [];
            $scope.page = 0;
         }
         PartnerFactory.distance( $scope.page, $scope.filterData, position.coords.latitude + "|" + position.coords.longitude ).then(function( response ){
            $rootScope.partners = $rootScope.partners.concat(response.data);
            $rootScope.partners.push(response.data);
            if( response.data.length > 9 ) {
               $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
               $scope.moreDataCanBeLoaded = function() {return false;};
            }
            $scope.page += 1;
            $scope.spinninghide = true;

            if( response.data.error ) {
               $scope.no_results = false;
            } else {
               $scope.no_results = true;
            }

         }).catch(function(response){
            $scope.spinninghide = true;
         });

     };
     $scope.loadMore(1);


    }, function(err) {

      alert("Bitte aktivieren Sie Ihr GPS.");
      return 0;

    });

   // Init Call
   $scope.Filtering = function() {
      $scope.loadMore(1);
   }

})

/* ------------------------------------------------------------------------------------------------------------------------------------------- */
/* IN DER NAEHE */
.controller("MoreCtrl", function($scope, $state, PartnerFactory) {

   $scope.spinninghide = false;
   PartnerFactory.more().then(function(response){

      $scope.more = response.data;
      $scope.spinninghide = true;

	}).catch(function(response){

      $scope.spinninghide = true;

	});


})

/* ------------------------------------------------------------------------------------------------------------------------------------------- */
