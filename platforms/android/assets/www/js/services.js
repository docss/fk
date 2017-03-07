angular.module('starter')

.factory('PartnerFactory', function ($http, $rootScope, $stateParams) {

  return {
    all: function ( page, filters, favs ) {
      	// return $http.get('https://friends.json/all', { params: { user_id: $rootScope.session } })
      	return $http.post("http://www.familienkarte-gs.de/app/app.php", {action: "list", p: page, filters, favs })
    },
    favoriten: function( page, favs ) {
         return $http.post("http://www.familienkarte-gs.de/app/app.php", {action: "favoriten", p: page, favs })
    },
    single: function () {
		return $http.post("http://www.familienkarte-gs.de/app/app.php", {action: "partner", ID: $stateParams.userID})
    },
    filter: function ( page, filters ) {
      	return $http.post("http://www.familienkarte-gs.de/app/app.php", {action: "list", p: page, filter: filters})
    }
  };

})
.factory("FilterFactory", function( $http, $rootScope, $stateParams ) {

	return {
		orte: function() {
			return $http.post("http://www.familienkarte-gs.de/app/app.php", {action: "orte"})
		},
		branchen: function() {
			return $http.post("http://www.familienkarte-gs.de/app/app.php", {action: "branchen"});
		}
	};

})

.factory('StorageService', function ($localStorage) {
   $localStorage = $localStorage.$default({
      fav: []
   });
   var _getAll = function () {
     return $localStorage.fav;
   };
   var _get = function ( fav ) {
      return $localStorage.fav.indexOf(fav);
   };
   var _add = function (fav) {
     $localStorage.fav.push(fav);
   }
   var _remove = function (fav) {
     $localStorage.fav.splice($localStorage.fav.indexOf(fav), 1);
   }
   var _deal = function ( fav ) {

   }
   return {
       getAll: _getAll,
       get: _get,
       add: _add,
       remove: _remove,
       deal: _deal
   };

});
