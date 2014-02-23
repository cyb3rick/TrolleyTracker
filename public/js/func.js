function addMarkerListener(map,marker){
	google.maps.event.addListener(marker, 'click', function() {
        map.panTo(marker.getPosition());
    });
}

function animateSymbol(polyline) {
	var count = 0;
	var step = 64;
	window.setInterval(function() {
		count = (count + 1) % (step*100);

		var icons = polyline.get('icons');
		icons[0].offset = (count / step) + '%';
		polyline.set('icons', icons);
	}, 20);
}

function animateMarker(marker,marker_path,polyline) {
	var coords;
	var index = 0;
	setInterval(function() {
		coords = marker_path[index % marker_path.length];
		index++;
		marker.setVisible(google.maps.geometry.poly.isLocationOnEdge(coords, polyline, 0.0005));
		marker.setPosition(coords);
	}, 100);
}

function animateMarker2(update) {
	var tname;
	var tlatlng;
	
	//if id exists, update position to tlatlng
	//if id is new, create marker with initial pos tlatlng
	//if trolley has been inactive for a looong while, hide/remove marker object?
}

function centerOnPath(path,map) {
	var maxLat = path.getAt(0).d;
	var minLat = path.getAt(0).d;
	var maxLng = path.getAt(0).e;
	var minLng = path.getAt(0).e;
	
	for(index = 1; index < path.getLength(); index++){
		if(path.getAt(index).d > maxLat){
			maxLat = path.getAt(index).d;
		}
		
		if(path.getAt(index).d < minLat){
			minLat = path.getAt(index).d;
		}
		
		if(path.getAt(index).e > maxLng){
			maxLng = path.getAt(index).e;
		}
		
		if(path.getAt(index).e < minLng){
			minLng = path.getAt(index).e;
		}
	}
	//console.log("Min Lat: "+minLat+"Max Lat: "+maxLat+"Min Lng: "+minLng+"Max Lng: "+maxLng);
	var SW = new google.maps.LatLng(minLat,minLng);
	var NE = new google.maps.LatLng(maxLat,maxLng);

	var bounds = new google.maps.LatLngBounds(SW, NE);
	map.fitBounds(bounds);
}

function DefaultViewControl(controlDiv, map, location) {
  controlDiv.style.padding = '5px';

  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '2px';
  controlUI.style.marginTop = '8px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to set map to default view';
  controlDiv.appendChild(controlUI);

  var controlText = document.createElement('div');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = '<b>Default View</b>';
  controlUI.appendChild(controlText);

  google.maps.event.addDomListener(controlUI, 'click', function() {
  	map.setCenter(location);
  	map.setZoom(17);
  });
}

function RouteControl(controlDiv, map, title, innerHTML, polyline) {
  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

  // Set CSS for the control border
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '2px';
  controlUI.style.marginTop = '5px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = ''+title;
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = '<b>'+innerHTML+'</b>';
  controlUI.appendChild(controlText);

  // Setup the click event listeners
  google.maps.event.addDomListener(controlUI, 'click', function() {
    if(polyline.getVisible()){ 
      polyline.setVisible(false);
   }
   else{
      polyline.setVisible(true);
      centerOnPath(polyline.getPath(),map);
      var pathlength = google.maps.geometry.spherical.computeLength(polyline.getPath().getArray());
      var kms = Math.round(pathlength/1000 * 100) / 100;
      var miles = Math.round(pathlength/1609 * 100) / 100;
      console.log('Path length is: '+miles+' miles ('+kms+' kilometers). ');
      }
  });
}