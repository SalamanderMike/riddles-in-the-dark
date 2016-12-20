Crtl = angular.module('Controllers', []);

Crtl.controller('AppController', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
	var app = this;
	var location,
		mapOptions,
		marker,
		map;
	$scope.focusFocus = false;
	$scope.toggle = true;
	$scope.views = {
		CLUE1: 	true,
		CLUE2: 	false,
		CLUE3: 	false,
		CLUE4: 	false
	};

// GOOGLE MAPS
	(function() {
		$http.get('/config').then(function(response) {
			var map_auth = "https://maps.googleapis.com/maps/api/js?key="+ response.data;
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = map_auth;
			document.body.appendChild(script);
		}), function(err) {
			console.log("Could Not Find ENV Variable", err);
		};
	})();

	function initMap() {
		location = new google.maps.LatLng(37.598606, -122.065635);
		mapOptions = { 
			center: location,
			zoom: 9,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		marker = new google.maps.Marker({
		    position: location,
		    title:"Your Christmas gift!"
		});
		map = new google.maps.Map(document.getElementById('map'), mapOptions);
		marker.setMap(map);
	};
	$timeout(function() {
		initMap();
	},500)

	app.refreshMaps = function() {
		$timeout(function() {
			map = new google.maps.Map(document.getElementById('map'), mapOptions);	
		},0).then(function() {
			google.maps.event.addListenerOnce(map, 'idle', function() {
				google.maps.event.trigger(map, 'resize');
				marker.setMap(map);
			});
		})
	};


// SECTION: NAV-TABS
	app.tabFunction = function(tab) {
		views = $scope.views;
		angular.forEach(Object.keys(views), function(page) {
			if (tab != page) {
				views[page] = false;
			} else {
				views[page] = true;
			};
		});
		if (tab === "CLUE3") app.refreshMaps();
		$scope.views = views;
	};



// TEST AREA (HARD HAT REQUIRED)
// END OF TEST AREA




// SLIDING SIDE MENU
	$scope.leftVisible = false;
	$scope.rightVisible = false;

	app.close = function() {
		$scope.leftVisible = false;
		$scope.rightVisible = false;
	};

	app.showLeft = function(e) {
		$scope.leftVisible = true;
		e.stopPropagation();
	};

	app.showRight = function(e) {
		$scope.rightVisible = true;
		e.stopPropagation();
	};

	$rootScope.$on("documentClicked", _close);
	$rootScope.$on("escapePressed", _close);

	function _close() {
		$scope.$apply(function() {
			app.close(); 
		});
	};
}]);
