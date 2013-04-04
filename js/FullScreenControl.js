function FullScreenControl(map) {
	var controlDiv = document.createElement('div');
	controlDiv.index = 1;
	controlDiv.style.padding = '5px';

	// Set CSS for the control border.
	var controlUI = document.createElement('div');
	controlUI.style.backgroundColor = 'white';
	controlUI.style.borderStyle = 'solid';
	controlUI.style.borderWidth = '1px';
	controlUI.style.borderColor = '#717b87';
	controlUI.style.cursor = 'pointer';
	controlUI.style.textAlign = 'center';
	controlUI.style.boxShadow = '0px 2px 4px rgba(0,0,0,0.4)';
	controlDiv.appendChild(controlUI);

	// Set CSS for the control interior.
	var controlText = document.createElement('div');
	controlText.style.fontFamily = 'Arial,sans-serif';
	controlText.style.fontSize = '13px';
	controlText.style.paddingTop = '1px';
	controlText.style.paddingBottom = '1px';
	controlText.style.paddingLeft = '6px';
	controlText.style.paddingRight = '6px';
	controlText.innerHTML = '<strong>Full Screen</strong>';
	controlUI.appendChild(controlText);

	var fullScreen = false;
	var mapDiv = map.getDiv();
	var divStyle = mapDiv.style;
	if (mapDiv.runtimeStyle)
		divStyle = mapDiv.runtimeStyle;
	var originalPos = divStyle.position;
	var originalWidth = divStyle.width;
	var originalHeight = divStyle.height;
	var originalTop = divStyle.top;
	var originalLeft = divStyle.left;
	var originalZIndex = divStyle.zIndex;

	var bodyStyle = document.body.style;
	if (document.body.runtimeStyle)
		bodyStyle = document.body.runtimeStyle;
	var originalOverflow = bodyStyle.overflow;
	
	// Setup the click event listener
	google.maps.event.addDomListener(controlUI, 'click', function() {
		var center = map.getCenter();
		if (!fullScreen) {
			divStyle.position = "fixed";
			divStyle.width = "100%";
			divStyle.height = "100%";
			divStyle.top = "0";
			divStyle.left = "0";
			divStyle.zIndex = "100";
			bodyStyle.overflow = "hidden";
			controlText.innerHTML = '<strong>Exit full screen</strong>';
		}
		else {
			if (originalPos == "")
				divStyle.position = "relative";
			else
				divStyle.position = originalPos;
			divStyle.width = originalWidth;
			divStyle.height = originalHeight;
			divStyle.top = originalTop;
			divStyle.left = originalLeft;
			divStyle.zIndex = originalZIndex;
			bodyStyle.overflow = originalOverflow;
			controlText.innerHTML = '<strong>Full Screen</strong>';
		}
		fullScreen = !fullScreen;
		google.maps.event.trigger(map, 'resize');
		map.setCenter(center);
	});
	
	return controlDiv;
}