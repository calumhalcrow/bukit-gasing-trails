$(function () {
    bukitGasing().init();
});

var bukitGasing = function () {
    var that = {};
    var ways = [];
    var map;
    var positions_with_icons = [];
    var icons_hidden = true;
    var markers = [];

    that.init = function () {
        that.init_map();
        that.fetch_ways();
    };

    that.init_map = function () {
        var mapOptions = {
            center: new google.maps.LatLng(3.097943, 101.660782),
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    };

    that.fetch_ways = function () {
        var request = $.ajax({
            url: "/ways.json?enabled=true"
        });
        request.done(function (ways_array) {
            ways = ways_array;
            that.display_ways_on_map();
            that.set_positions_with_icons();
            google.maps.event.addListener(map, 'zoom_changed', that.on_zoom_changed);
        });
    };

    that.display_ways_on_map = function () {
        ways.forEach(function (way) {
            var coords = new Array();

            way.positions.forEach(function (position) {
                var latLng = new google.maps.LatLng(position.node.lat, position.node.lon);
                coords.push(latLng);
            });

            var polyTypeAndOptions = that.poly_type_and_options(way);
            var polyType = polyTypeAndOptions[0];
            var options = polyTypeAndOptions[1];
            options['path'] = coords;

            var shape = new google.maps[polyType](options);
            shape.setMap(map);

            that.make_info_window_event(shape, way);
        });
    };

    that.make_info_window_event = function (shape, way) {
        google.maps.event.addListener(shape, 'click', function (event) {
            var infoWindow = new google.maps.InfoWindow({
                content: 'ID: '+way['id'],
                position: event.latLng
            });
            infoWindow.open(map);
        });
    };

    that.set_positions_with_icons = function () {
        ways.forEach(function (way) {
            way.positions.forEach(function (position) {
                if (position.icon) {
                    positions_with_icons.push(position);
                }
            });
        });
    };

    that.on_zoom_changed = function () {
        var zoomLevel = map.getZoom();
        if (zoomLevel >= 18 && icons_hidden) {
            that.show_icons();
            icons_hidden = false;
        } else if (zoomLevel < 18 && !icons_hidden) {
            that.hide_icons();
            icons_hidden = true;
        }
    };

    that.show_icons = function () {
        positions_with_icons.forEach(function (position) {
            var latLng = new google.maps.LatLng(position.node.lat, position.node.lon);

            // Add placemark at this position with icon.
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                icon: '/assets/'+position.icon+'.png'
            });

            markers.push(marker);

            var infoWindow = new google.maps.InfoWindow({
                content: position.desc,
                maxWidth: 200
            });

            google.maps.event.addListener(marker, 'click', function() {
              infoWindow.open(map, marker);
            });
        });
    };

    that.hide_icons = function () {
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
    };

    that.poly_type_and_options = function (way) {
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
        } else if (way.category == 'place_of_worship' || way.category == 'cemetery' || way.category == 'playground') {
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
        } else if (way.category == 'bridge') {
            polyType = 'Polyline';
            options = {
                strokeColor: '#000000',
                strokeOpacity: 1.0,
                strokeWeight: 5,
                zIndex: 10
            };
        }
        return [polyType, options];
    };

    return that;
};
