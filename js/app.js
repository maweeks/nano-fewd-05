// Variable containing the google map.
var map;

// Variable containing all startup data.
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
		// rounded for simpler code: {lat: 51.27952748155, lng: 1.0807975555419}
		center: { lat: 51.2795, lng: 1.0808},
    	disableDefaultUI: true,
		zoom: 14
	}
};

// Variable to store the view model in.
var myViewModel;


// ModelView
var ViewModel = function() {
	var self = this;

	self.locationsList = 0;
	self.selected = ko.observable( "" );

	// details
	self.detailsClass = ko.observable( "overlayTwo notNow" );
	self.detailsHTML = ko.observable( "" );
	self.generateDetails = function() {
		self.detailsHTML( '<h3>' + self.selected() + '</h3>' );
	};
	self.generateError = function() {
		self.detailsHTML( '<h3>Nothing currently selected.</h3><em> Select a pin on the map to view more details. </em>' );
	};
	self.hideDetails = function() {
		self.detailsClass(self.detailsClass().replace(" notNow", "") + " notNow");
	};
	self.showDetails = function() {
		self.detailsClass(self.detailsClass().replace(" notNow", ""));
		console.log(self.selected())
		if (self.selected() != "") {
			self.generateDetails();
		}
		else {
			self.generateError();
		}
	};

	// search
	self.hideSearch = function() {
		self.searchClass(self.searchClass().replace(" notNow", "") + " notNow");
	};
	self.searchClass = ko.observable( "overlayTwo notNow" );
	self.showSearch = function() {
		self.searchClass(self.searchClass().replace(" notNow", ""));
	};
}

var FullMap = {
	calculateCenter: function() {
		FullMap.center = map.getCenter();
	},
	center: 0,
	initialize: function() {
		// var bounds = new google.maps.LatLngBounds();
		map = new google.maps.Map(document.getElementById('map-canvas'), mapData.options);
		var markers = [];

		google.maps.event.addDomListener(map, 'idle', function() {
			FullMap.calculateCenter();
		});
		google.maps.event.addDomListener(window, 'resize', function() {
			map.setCenter(FullMap.center);
		});

		for (var i = 0; i < mapData.locations.length; i++) {
			// console.log(i);
			var request = mapData.locations[i];
		 	var infowindow = new google.maps.InfoWindow();
			var service = new google.maps.places.PlacesService(map);


			google.maps.event.addListener(infowindow,'closeclick',function(){
				myViewModel.selected("");
				myViewModel.generateError();
			});

			service.getDetails(request, function(place, status) {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					var marker = new google.maps.Marker({
						map: map,
						position: place.geometry.location
					});
					markers.push(marker);
					google.maps.event.addListener(markers[markers.length-1], 'click', function() {

						myViewModel.selected(place.name);
						myViewModel.generateDetails();

						var infoWindowText = "<a href='javascript:myViewModel.showDetails();' >" + place.name + "</a>: ";
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
	// DetailView.renderNotShowing();
	FullMap.initializeMap();
	myViewModel = new ViewModel();
	ko.applyBindings(myViewModel);
}