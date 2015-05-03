var map;
var mapData = {
	center: 0,
	locations: [
		{placeId: "ChIJh8UibbXL3kcRSeRb7F8fDDo"}, //Ball Room
		//{placeId: "ChIJ_bpIw7XL3kcR09ogp8rgfCg"}, //Black Griffin
		{placeId: "ChIJ6Z00V8nL3kcRhNSJi_KNoIE"}, //Chemistry
		{placeId: "ChIJhTdHADXK3kcRpnOnvhy-6lQ"}, //Chill
		{placeId: "ChIJB40BgMrL3kcRr07WbPUriKk"}, //Cuban
		{placeId: "ChIJ756NpcrL3kcRftgyPZzEosI"}, //Essence
		{placeId: "ChIJD56WI0vK3kcRr9FHIPvV7Tc"}, //Jolly Sailor
		{placeId: "ChIJeWgu2rXL3kcRfYSayANVg2c"}, //Lady Luck
		{placeId: "ChIJZSe6hEvK3kcRJuT5Xkt0xzI"}, //Penny
		{placeId: "ChIJrRZKbbXL3kcRFZEAiJtAVow"}, //Seven Stars
		{placeId: "ChIJfdVmUMrL3kcRwCu3hudCZpo"}  //Three Tuns
	], //https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
	options: {
		center: { lat: 51.27953, lng: 1.08080},
		// center: { lat: 51.27952748155, lng: 1.0807975555419},
    	disableDefaultUI: true,
		zoom: 14
	},
	selected: ""
};

// var detailData = {
// 	arrow: "img/arrowLeft.png"
// };

// ModelView
var ViewModel = function() {
	var self = this;
	// this.detailButtonClick = ko.observable(  );
	// this.detailButtonSrc = ko.observable( detailData.arrow );
}

// Views
var DetailView = {
	renderNotShowing: function () {
		var detailsElement = document.getElementById('detailsContent');
		detailsElement.className = detailsElement.className.replace(' notNow', '');
		detailsElement.className += ' notNow';
	},
	renderShowing: function() {
		// console.log(selected);
		var detailsElement = document.getElementById('detailsContent');
		detailsElement.className = detailsElement.className.replace(' notNow', '');
		if (mapData.selected != "") {
			DetailView.createMapData();
		}
		else {
			console.log("Showing empty");
			document.getElementById('detailsInfo').innerHTML = '<h3>Nothing currently selected.</h3><em> Select a pin on the map to view more details. </em>';
		}
	}
};

var SearchView = {
	renderNotShowing: function () {
		var detailsElement = document.getElementById('searchContent');
		detailsElement.className = detailsElement.className.replace(' notNow', '');
		detailsElement.className += ' notNow';
	},
	renderShowing: function() {
		// console.log(selected);
		var detailsElement = document.getElementById('searchContent');
		detailsElement.className = detailsElement.className.replace(' notNow', '');
		if (mapData.selected != "") {
			document.getElementById('detailsInfo').innerHTML = ViewModel.createDetailedData();
		}
		else {
			console.log("Showing empty");
			document.getElementById('detailsInfo').innerHTML = '<h3>Nothing currently selected.</h3><em> Select a pin on the map to view more details. </em>';
		}
	}
}
// var KeyView = {};
// var ListView = {};

var FullMap = {
	calculateCenter: function() {
		mapData.center = map.getCenter();
	},
	initialize: function() {
		// var bounds = new google.maps.LatLngBounds();
		map = new google.maps.Map(document.getElementById('map-canvas'), mapData.options);
		var markers = [];
		var mapBounds = [];

		google.maps.event.addDomListener(map, 'idle', function() {
			FullMap.calculateCenter();
		});
		google.maps.event.addDomListener(window, 'resize', function() {
			map.setCenter(mapData.center);
		});

		for (var i = 0; i < mapData.locations.length; i++) {
			// console.log(i);
			var request = mapData.locations[i];
		 	var infowindow = new google.maps.InfoWindow();
			var service = new google.maps.places.PlacesService(map);


					google.maps.event.addListener(infowindow,'closeclick',function(){
						console.log("close")
					});

			service.getDetails(request, function(place, status) {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					var marker = new google.maps.Marker({
						map: map,
						position: place.geometry.location
					});
					markers.push(marker);
					google.maps.event.addListener(markers[markers.length-1], 'click', function() {
						var infoWindowText = place.name + ": ";
						try {
							if (place.opening_hours.open_now) {
								infoWindowText += "Open.";
							}
							else {
								infoWindowText += "Closed.";
							}
						}
						catch(err) {
							infoWindowText += "Opening times unavailable.";
						}
						infowindow.setContent(infoWindowText);
						infowindow.open(map, this);
					});
				}
				if (markers.length == mapData.locations.length) {
					FullMap.calculateCenter();
				}
			});
		}
	},
	initializeMap: function() {
		google.maps.event.addDomListener(window, 'load', FullMap.initialize);
	}
}

function initializePage() {
	//ko.applyBindings(new ViewModel());
	// DetailView.renderNotShowing();
	FullMap.initializeMap();
}

initializePage();