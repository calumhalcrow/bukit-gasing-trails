$(function () {
    var mapOptions = {
        center: new google.maps.LatLng(3.097943, 101.660782),
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    var request = $.ajax({
        url: "/ways.json?enabled=true"
    });
    request.done(function(ways) {
        ways.forEach(function(way) {
            var coords = new Array();
            way.positions.forEach(function(position) {
                coords.push(new google.maps.LatLng(position.node.lat, position.node.lon));
            });
            var polyTypeAndOptions = PolyTypeAndOptions(way);
            var polyType = polyTypeAndOptions[0];
            var options = polyTypeAndOptions[1];
            options['path'] = coords;

            var shape = new google.maps[polyType](options);
            shape.setMap(map);

            makeInfoWindowEvent(map, shape, way);

        });
    });
});

function makeInfoWindowEvent(map, shape, way) {
  google.maps.event.addListener(shape, 'click', function(event) {
    var infoWindow = new google.maps.InfoWindow({
        content: 'ID: '+way['id'],
        position: event.latLng
    });
    infoWindow.open(map);
  });
}

var PolyTypeAndOptions = function (way) {
    var options = {};
    var polyType;
    if (way.category == 'trail') {
        polyType = 'Polyline';
        options = {
            strokeColor: '#7C4D27',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            zIndex: 10
        };
    } else if (way.category == 'boundary') {
        polyType = 'Polygon';
        options = {
            strokeColor: "#196224",
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: "#196224",
            fillOpacity: 0.05,
            clickable: false
        };
    } else if (way.category == 'reservoir') {
        polyType = 'Polygon';
        options = {
            strokeColor: "#2E546A",
            strokeOpacity: 0.5,
            strokeWeight: 1,
            fillColor: "#54A9D9",
            fillOpacity: 0.5,
            clickable: false
        };
    } else if (way.category == 'place') {
        polyType = 'Polygon';
        options = {
            strokeColor: "#7D4281",
            strokeOpacity: 0.5,
            strokeWeight: 1,
            fillColor: "#B440BB",
            fillOpacity: 0.5,
            clickable: false
        };
    } else if (way.category == 'parking') {
        polyType = 'Polygon';
        options = {
            strokeColor: "#AFA941",
            strokeOpacity: 0.5,
            strokeWeight: 1,
            fillColor: "#F0E328",
            fillOpacity: 0.5,
            clickable: false
        };
    } else if (way.category == 'road') {
        polyType = 'Polyline';
        options = {
            strokeColor: '#ffffff',
            strokeOpacity: 1.0,
            strokeWeight: 4,
            zIndex: 10
        };
    }
    return [polyType, options];
};
