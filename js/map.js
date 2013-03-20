$(function () {
    bukitGasing().init();
});

var bukitGasing = function () {
    var that = {};
    var ways = [];
    var points = [];
    var currentOpenInfoWindow;
    var map;
    var iconsHidden = true;
    var markers = [];

    that.init = function () {
        that.init_map();
        that.fetch_ways();
    };

    that.init_map = function () {
        var mapOptions = {
            center: new google.maps.LatLng(3.097943, 101.660782),
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.HYBRID
        };
        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    };

    that.fetch_ways = function () {
        var request = $.ajax({
            url: "/js/map.json",
            dataType: 'json'
        });
        request.done(function (data) {
            ways = data.ways;
            points = data.points;
            that.display_ways_on_map();
            google.maps.event.addListener(map, 'zoom_changed', that.on_zoom_changed);
        });
    };

    that.display_ways_on_map = function () {
        $.each(ways, function (index, way) {
            if (way.disabled) {
                return false;
            }

            var coords = new Array();

            $.each(way.positions, function (index, position) {
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

    that.make_info_window_event = function (shape, model) {
        google.maps.event.addListener(shape, 'click', function (event) {
            var position = shape.position || event.latLng;
            var infoWindow = new google.maps.InfoWindow({
                content: that.info_window_content(model),
                position: position,
                maxWidth: 500
            });

            if (currentOpenInfoWindow) {
                currentOpenInfoWindow.close();
            }
            currentOpenInfoWindow = infoWindow;

            infoWindow.open(map);
        });
    };

    that.on_zoom_changed = function () {
        var zoomLevel = map.getZoom();
        if (zoomLevel >= 18 && iconsHidden) {
            that.show_icons();
            iconsHidden = false;
        } else if (zoomLevel < 18 && !iconsHidden) {
            that.hide_icons();
            iconsHidden = true;
        }
    };

    that.show_icons = function () {
        $.each(points, function (index, point) {
            if (point.disabled) {
                return false;
            }

            var latLng = new google.maps.LatLng(point.node.lat, point.node.lon);

            // Add placemark at this position with icon.
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                icon: '/img/'+point.category+'.png'
            });

            markers.push(marker);
            that.make_info_window_event(marker, point);
        });
    };

    that.info_window_content = function (model) {
        var content = '<div class="infowindow"><h1>'+model.name+'</h1>';
        if (model.thumb) {
            content = content+'<img src="'+model.thumb+'"/>';
        }
        if (model.desc) {
            content = content+'<p>'+model.desc+'</p>';
        }
        content = content+'</div>';
        return content;
    };

    that.hide_icons = function () {
        $.each(markers, function (index, marker) {
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
                fillOpacity: 0.5
            };
        } else if (way.category == 'place_of_worship' || way.category == 'cemetery' || way.category == 'playground' || way.category == 'park') {
            polyType = 'Polygon';
            options = {
                strokeColor: "#7D4281",
                strokeOpacity: 0.5,
                strokeWeight: 1,
                fillColor: "#B440BB",
                fillOpacity: 0.5
            };
        } else if (way.category == 'parking') {
            polyType = 'Polygon';
            options = {
                strokeColor: "#AFA941",
                strokeOpacity: 0.5,
                strokeWeight: 1,
                fillColor: "#F0E328",
                fillOpacity: 0.5
            };
        } else if (way.category == 'road') {
            polyType = 'Polyline';
            options = {
                strokeColor: '#ffffff',
                strokeOpacity: 0.5,
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
