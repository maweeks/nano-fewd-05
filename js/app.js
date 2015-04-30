// Models
var mapData = {
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
		center: { lat: 51.2784, lng: 1.0826},
		zoom: 14
	}
};
var map;
// Views
// var DetailView = {};
// var KeyView = {};
// var ListView = {};

var MapView = function() {

};

// ModelViews
var ModelView = function() {

};

function initialize() {
	// var bounds = new google.maps.LatLngBounds();
	map = new google.maps.Map(document.getElementById('map-canvas'), mapData.options);
	var markers = [];
	var mapBounds = [];
	for (var i = 0; i < mapData.locations.length; i++) {
		// console.log(i);
		var request = mapData.locations[i];
	 	var infowindow = new google.maps.InfoWindow();
		var service = new google.maps.places.PlacesService(map);
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

			google.maps.event.addDomListener(map, 'idle', function() {
			  calculateCenter();
			});
			google.maps.event.addDomListener(window, 'resize', function() {
			  map.setCenter(center);
			  console.log("shis")
			});
			// if (markers.length == mapData.locations.length) {
			// 	for(i=0;i<markers.length;i++) {
			// 		bounds.extend(markers[i].getPosition());
			// 		console.log()
			// 	}
			// 	map.fitBounds(bounds);
			// }
		});
	}
	// window.addEventListener('resize', function(e) {
	//   // Make sure the map bounds get updated on page resize
	//   map.fitBounds(mapBounds);
	// });
}

var center;
function calculateCenter() {
  center = map.getCenter();
}

google.maps.event.addDomListener(window, 'load', initialize);