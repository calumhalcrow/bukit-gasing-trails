// TODO
// - plot an OSM path.
// plot OSM's park boundary.
function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(3.097943, 101.660782),
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);







    Object.keys(coords.gpsRecordings).forEach(function(date) {
        //if (date == '2012-10-06') {
            //return;
        //}
        var recCoords = new Array();
        coords.gpsRecordings[date].forEach(function(coord) {
            var latLng = new google.maps.LatLng(coord.lat,coord.lng);

            recCoords.push(latLng);

            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: date+' '+coord.time
            });
        });
        var strokeColor = (date == '2012-10-06') ? '#ff0000' : '#00ff00';
        var walk = new google.maps.Polyline({
            path: recCoords,
            strokeColor: strokeColor,
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        walk.setMap(map);
    });


    ['tamanRimba', 'vilaDbkl', 'graveyard'].forEach(function(place) {
        var placeCoords = new Array();
        coords[place].forEach(function(coord) {
            placeCoords.push(new google.maps.LatLng(coord.lat, coord.lng));
        });
        (new google.maps.Polygon({ paths: placeCoords })).setMap(map);
    });
}

window.onload = initialize;
