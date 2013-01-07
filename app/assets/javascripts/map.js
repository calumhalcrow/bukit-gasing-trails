$(function () {
    var mapOptions = {
        center: new google.maps.LatLng(3.097943, 101.660782),
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    var request = $.ajax({
        url: "/ways.json"
    });
    request.done(function(ways) {
        ways.forEach(function(way) {
            var coords = new Array();
            way.nodes.forEach(function(node) {
                coords.push(new google.maps.LatLng(node.lat, node.lon));
            });
            var shape = Shape(way);
            var options = ShapeOptions(shape);
            options['path'] = coords;

            (new google.maps[shape](options)).setMap(map);
        });
    });
});

var Shape = function (way) {
    return (way.category == 'trail') ? 'Polyline' : 'Polygon';
};

var ShapeOptions = function (shape) {
    var options = {};
    if (shape == 'Polyline') {
        options = {
            strokeColor: '#00ff00',
            strokeOpacity: 1.0,
            strokeWeight: 2
        };
    }
    return options;
};
