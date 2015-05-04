// Variable containing the google map.
var map;

// Variable containing all startup data.
var mapData = {
	locations: [
		{placeId: "ChIJh8UibbXL3kcRSeRb7F8fDDo"}, //Ball Room
		// {placeId: "ChIJ_bpIw7XL3kcR09ogp8rgfCg"}, //Black Griffin
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

	self.locationsList = ko.observableArray([]);
	self.selected = ko.observable( "" );
	self.selectedMarker = ko.observable( "" );

	// details
	self.detailsClass = ko.observable( "overlayTwo notNow" );
	self.detailsHTML = ko.observable( "" );
	self.generateDetails = function() {
		var details = self.generateDetailsName();
		details += self.generateDetailsWeb();
		details += self.generateDetailsPhone();
		details += self.generateDetailsAddress();
		details += self.generateDetailsOpen();
		details += self.generateDetailsOpeningTimes();
		details += self.generateDetailsGoogleRating();
		self.detailsHTML( details );
	};
	self.generateError = function() {
		self.detailsHTML( '<h3>Nothing currently selected.</h3><em> Select a pin on the map to view more details. </em>' );
	};
	self.generateDetailsName = function() {
		if (self.selected().name != undefined) {
			return '<h2>' + self.selected().name + '</h2>';
		}
		else {
			return '<h2>Name unavailable</h2>';
		}
	};
	self.generateDetailsWeb = function() {
		if (self.selected().website != undefined) {
			return '<em>Website: </em><a href="' + self.selected().website + '">' + self.selected().name + '</a><br/><br/>';
		}
		else {
			return '<em>Website: </em>unavailable<br/><br/>';
		}
	};
	self.generateDetailsPhone = function() {
		if (self.selected().formatted_phone_number != undefined) {
			return '<em>Phone: </em> ' + self.selected().formatted_phone_number + '<br/><br/>';
		}
		else {
			return '<em>Phone: </em> unavailable<br/><br/>';
		}
	};
	self.generateDetailsAddress = function() {
		if (self.selected().formatted_address != undefined) {
			return '<em>Address: </em> ' + self.selected().formatted_address + '<br/><br/>';
		}
		else {
			return '<em>Address: </em> unavailable<br/><br/>';
		}
	};
	self.generateDetailsOpen = function() {
		if (self.selected().opening_hours != undefined) {
			if (self.selected().opening_hours.open_now) {
				return '<em>Status: </em>open for business!<br/><br/>';
			}
			else {
				return '<em>Status: </em>closed<br/><br/>';
			}
		}
		else {
			return '';
		}
	};
	self.generateDetailsOpeningTimes = function() {
		if (self.selected().opening_hours != undefined) {
			var openHTML = '<em>Opening times:</em><br/>';
			for (var i = 0; i < self.selected().opening_hours.weekday_text.length; i++) {
				openHTML +=self.selected().opening_hours.weekday_text[i] + '<br/>';
			}
			return openHTML + '<br/>';
		}
		else {
			return '<em>Opening times: </em>unavailable<br/><br/>';
		}
	};
	self.generateDetailsGoogleRating = function() {
		if (self.selected().rating != undefined ) {
			return '<em>Google rating: </em>' + self.selected().rating + '/5<br/><br/>';
		}
		else {
			return '<em>Google rating: </em>unavailable<br/><br/>';
		}
	};
	// self.generateDetailsName = fucntion() {};
	self.hideDetails = function() {
		self.detailsClass(self.detailsClass().replace(" notNow", "") + " notNow");
	};
	self.showDetails = function() {
		self.detailsClass(self.detailsClass().replace(" notNow", ""));
		if (self.selected() != "") {
			self.generateDetails();
		}
		else {
			self.generateError();
		}
	};

	self.listNames = function() {
		for (var i = 0; i < self.locationsList().length; i++ ) {
			console.log(self.locationsList()[i].name);
		}
	}

	// search
	self.currentFilter = ko.observable( "" );

	self.currentFilter.subscribe(function () {
	   self.filteredLocations(self.filter());
	   self.generateMarkers();
	});
	self.listItemClick = function(index) {
		google.maps.event.trigger(myViewModel.filteredLocations()[index].marker, 'click');
	}
	self.locationsList.subscribe(function () {
		self.filteredLocations(self.filter());
	   self.generateMarkers();
	})

	self.filter = function() {
		if (self.currentFilter() != "") {
			return ko.utils.arrayFilter(self.locationsList(), function(loc) {
                return (loc.name.toUpperCase().indexOf(self.currentFilter().toUpperCase()) > -1);
            });
		}
		else {
			return self.locationsList();
		}
	}
	self.filteredLocations = ko.observableArray( self.filter() );
	self.generateMarkers = function() {
		// Hide all markers.
		for (var i = 0; i < self.locationsList().length; i++) {
			self.locationsList()[i].marker.setVisible(false);
		}
		// Show filtered markers.
		for (var i = 0; i < self.filteredLocations().length; i++) {
			self.filteredLocations()[i].marker.setVisible(true);
		}
	}
	self.hideSearch = function() {
		self.searchClass(self.searchClass().replace(" notNow", "") + " notNow");
	};

	self.searchClass = ko.observable( "overlayTwo notNow" );
	// self.searchClass = ko.observable( "overlayTwo" );

	self.showSearch = function() {
		self.searchClass(self.searchClass().replace(" notNow", ""));
	};
	self.sortLocationsList = function() {
		myViewModel.locationsList(myViewModel.locationsList.sort(function(left, right) { return left.name == right.name ? 0 : (left.name < right.name ? -1 : 1) }));
	}
}

var FullMap = {
	calculateCenter: function() {
		FullMap.center = map.getCenter();
	},
	center: 0,
	initialize: function() {
		// var bounds = new google.maps.LatLngBounds();
		map = new google.maps.Map(document.getElementById('map-canvas'), mapData.options);
		// var markers = [];

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
				myViewModel.selectedMarker().setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
				myViewModel.selected("");
				myViewModel.generateError();
			});
			FullMap.calculateCenter();
			service.getDetails(request, function(place, status) {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					var marker = new google.maps.Marker({
						icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
						map: map,
						position: place.geometry.location,
						visible: false
					});
					place.marker = marker;
					myViewModel.locationsList.push(place);

					google.maps.event.addListener(place.marker, 'click', function() {

						//clear selected
						if (myViewModel.selectedMarker() != "") {
							myViewModel.selectedMarker().setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
						}

						//select current marker
						this.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
						myViewModel.selectedMarker(this);
						myViewModel.selected(place);
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
					if (myViewModel.locationsList().length == mapData.locations.length) {
						myViewModel.sortLocationsList();
					}
				}
			});
		}
	},
	initializeMap: function() {
		google.maps.event.addDomListener(window, 'load', FullMap.initialize);
	}
}

function initializePage() {
	FullMap.initializeMap();
	myViewModel = new ViewModel();
	ko.applyBindings(myViewModel);
}