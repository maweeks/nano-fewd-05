// Models
var mapData = {
	locations: [ 

	//Ballroom
	//Black Griffin
	//Shakespear
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
		zoom: 15
	}
};

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
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapData.options);
	for (var i = 0; i < mapData.locations.length; i++) {
		var request = mapData.locations[i];
	 	var infowindow = new google.maps.InfoWindow();
		var service = new google.maps.places.PlacesService(map);
		service.getDetails(request, function(place, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			var marker = new google.maps.Marker({
				map: map,
				position: place.geometry.location
			});
			google.maps.event.addListener(marker, 'click', function() {
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
	});
	}
}

google.maps.event.addDomListener(window, 'load', initialize);