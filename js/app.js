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
		self.detailsHTML( '<h2>' + self.selected() + '</h2>' );
	};
	self.generateError = function() {
		self.detailsHTML( '<h3>Nothing currently selected.</h3><em> Select a pin on the map to view more details. </em>' );
	};
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
		self.hideMarkers();
		for (var i = 0; i < self.filteredLocations().length; i++) {
			self.locationsList()[i].marker.setVisible(true);
		}
	}
	self.hideMarkers = function() {
		for (var i = 0; i < self.locationsList().length; i++) {
			self.locationsList()[i].marker.setVisible(false);
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