Crtl = angular.module('Controllers', []);

Crtl.controller('AppController', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
	var app = this;
	var location,
		markerLoc,
		mapOptions,
		marker,
		map;
	$scope.loading = true;
	$scope.fireworks = false;
	$scope.answerTrackingOne = false;
	$scope.answerTrackingTwo = false;
	$scope.answerTrackingThree = false;
	$scope.fail = false;
	$scope.focusFocus = false;
	$scope.toggle = true;
	$scope.views = {
		INTRO: 		true,
		RIDDLE1: 	false,
		RIDDLE2: 	false,
		RIDDLE3: 	false,
		MAP: 		false
	};
	$scope.riddle = {};

	$scope.correct = function() {
		$timeout(function() {
		}, 2000).then(function() {
			$scope.fireworks = false;
		})
	};

	// LOADING FUNCTION
	(function() {
		$timeout(function() {
			$scope.loading = true;
		}, 20000).then(function() {
			$scope.loading = false;
		})
	})();

	// AUDIO PAUSE FUNCTION
	var play = true;
	var audio = document.getElementById('music');

	$scope.$on('pauseMusic', function(event, key) {
		switch (key) {
			case 32:                  
				if (play) {
					audio.pause();
					play = false;
				} else {
					audio.play();
					play = true;
				}
				break;
		}
	});


	$scope.riddles = function(data, riddle, data2) {
		$scope.fail = false;
		var answer = data.toLowerCase().replace(/\s+/g, '');
		var answer2 = data2.replace(/\s+/g, '');
		switch (riddle) {
			case "1":
				if (answer === "coordinates") {
					app.tabFunction("RIDDLE2");
					$scope.answerTrackingOne = true;
					$scope.fireworks = true;
					$scope.correct();
				} else {
					$scope.fail = true;
				};
				break;
			case "2":
				if (answer === "union") {
					app.tabFunction("RIDDLE3");
					$scope.answerTrackingTwo = true;
					$scope.fireworks = true;
					$scope.correct();
				} else {
					$scope.fail = true;
				};
				break;
			case "3":
				if (answer === "37.598606" || answer === "-122.065635") {
					if (answer2 === "37.598606" || answer2 === "-122.065635") {
						app.tabFunction("MAP");
						$scope.answerTrackingThree = true;
						$scope.fireworks = true;
						$scope.correct();
					} else {
						$scope.fail = true;
					};
				} else {
						$scope.fail = true;
				};
				break;
			default:
				$scope.riddle = {};
				$scope.fail = true;
		};
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
		markerLoc = new google.maps.LatLng(37.598460, -122.065635);
		var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
		var mapStyles = [
			{ //hide all fills
				elementType: 'geometry.fill',
				stylers: [{ visibility: 'off' }]
			},
			{	elementType: 'labels.text.stroke', stylers: [{color: '#6f3e00'}]},
			{	elementType: 'labels.text.fill', stylers: [{color: '#ffebba'}]},
			{
				featureType: 'road',
				elementType: 'geometry',
				stylers: [{color: '#ae6000'}]
			},
			{
				featureType: 'road',
				elementType: 'geometry.stroke',
				stylers: [{color: '#ae6000'}]
			},
			{
				featureType: 'road',
				elementType: 'labels',
				stylers: [{ visibility: "off" }]
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry',
				stylers: [{color: '#ae6000'}]
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry.stroke',
				stylers: [{color: '#ae6000'}]
			},
			{
				featureType: 'road.highway',
				elementType: 'labels',
				stylers: [{ visibility: "off" }]
			},
			{
				featureType: 'landscape.natural.landcover',
				elementType: 'geometry.fill',
				stylers: [{ visibility: 'on' }]
			},
			{
				featureType: 'water',
				elementType: 'geometry',
				stylers: [
					{color: '#0017C7'},
					{ saturation: -70 },
					{visibility: "on"}
				]
			}
		];
		mapOptions = { 
			center: location,
			zoom: 9,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			styles: mapStyles,
			scrollwheel:  false,
			backgroundColor: 'hsla(0, 0%, 0%, 0)'
		};

		marker = new google.maps.Marker({
			position: markerLoc,
			title:"Your Christmas gift!",
			icon: '../resources/map_compass.png'
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
		$scope.fail = false;
		views = $scope.views;
		angular.forEach(Object.keys(views), function(page) {
			if (tab != page) {
				views[page] = false;
			} else {
				views[page] = true;
			};
		});
		if (tab === "MAP") {
			app.refreshMaps();
		} 
		$scope.views = views;
	};



// SLIDING SIDE MENU
	// $scope.leftVisible = false;
	// $scope.rightVisible = false;

	// app.close = function() {
	// 	$scope.leftVisible = false;
	// 	$scope.rightVisible = false;
	// };

	// app.showLeft = function(e) {
	// 	$scope.leftVisible = true;
	// 	e.stopPropagation();
	// };

	// app.showRight = function(e) {
	// 	$scope.rightVisible = true;
	// 	e.stopPropagation();
	// };

	// $rootScope.$on("documentClicked", _close);
	// $rootScope.$on("escapePressed", _close);

	// function _close() {
	// 	$scope.$apply(function() {
	// 		app.close(); 
	// 	});
	// };
}]);
