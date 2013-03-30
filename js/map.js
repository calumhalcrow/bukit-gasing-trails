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
    var currentZoom = 16;
    var center = new google.maps.LatLng(3.097729, 101.664927);

    that.init = function () {
        that.init_map();
        that.fetch_ways();
        that.on_fullscreen_click();
        $('a#full-screen').on('click', that.on_fullscreen_click);
    };

    that.init_map = function () {
        var mapOptions = {
            center: center,
            zoom: currentZoom,
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
                return;
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
        currentZoom = map.getZoom();
        if (currentZoom >= 18 && iconsHidden) {
            that.show_icons();
            iconsHidden = false;
        } else if (currentZoom < 18 && !iconsHidden) {
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
        var options = {
            strokeColor: "#2E546A",
            strokeOpacity: 0.5,
            strokeWeight: 1
        };
        var polyType = 'Polyline';
        if (way.category == 'trail') {
            options['strokeColor'] = '#7C4D27';
            options['strokeOpacity'] = 1.0;
            options['strokeWeight'] = 2;
        } else if (way.category == 'place_of_interest') {
            polyType = 'Polygon';
            options['strokeColor'] = "#7D4281";
            options['fillColor'] = "#B440BB";
            options['fillOpacity'] = 0.5;
        } else if (way.category == 'park') {
            polyType = 'Polygon';
            options['strokeColor'] = "#154B07";
            options['fillColor'] = "#2DA011";
            options['fillOpacity'] = 0.5;
        } else if (way.category == 'parking') {
            polyType = 'Polygon';
            options['strokeColor'] = "#AFA941";
            options['fillColor'] = "#F0E328";
            options['fillOpacity'] = 0.5;
        } else if (way.category == 'road') {
            options['strokeColor'] = '#ffffff';
            options['strokeWeight'] = 4;
        } else if (way.category == 'stream') {
            options['strokeColor'] = '#0098DE';
            options['strokeWeight'] = 2;
        } else if (way.category == 'bridge') {
            options['strokeColor'] = '#2D1C0D';
            options['strokeOpacity'] = 1.0;
            options['strokeWeight'] = 5;
        }
        return [polyType, options];
    };

    that.on_fullscreen_click = function () {
        var sidecol = $('#side-col');
        if (sidecol.filter(':hidden').size()) {
            $('#map_canvas').animate({
                'left': '39%',
                'margin-right': '39%'
            }, function () {
                sidecol.show();
            });
        } else {
            sidecol.hide();
            $('#map_canvas').animate({
                'left': 0,
                'margin-right': 0
            });
        }
        return false;
    };

    return that;
};
