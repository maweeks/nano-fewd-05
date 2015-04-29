var Model = {};

var View = {};

var ModelView = {};

function initialize() {
var mapOptions = {
  center: { lat: 51.2750, lng: 1.0870},
  zoom: 12
};
var map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);