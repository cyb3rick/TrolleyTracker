var trolleyTracker = trolleyTracker || {};

(function(TT, $) {

	
	//Elements
	TT.el = {
		mapCanvas : $('#map-canvas')[0],
		infoBox : $('#infobox')[0]
	};

	
	//Vars

	//[map & properties]
	var map;
	var initCenter = new google.maps.LatLng(18.209438, -67.140543); //UPRM coords	
	var mapOptions = {
		minZoom : 16,
		zoom : 17,
		maxZoom : 18,
		center : initCenter,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		disableDefaultUI : true
	};

	//[demo symbols]
	var route1Symbol;
	var route2Symbol;
	var route3Symbol;
	var route4Symbol;
	var route5Symbol;

	//[bus stop markers]
	var markers = [];

	//[routes]
	var palacioRoute;
	var internoRoute;
	var darlingtonRoute;
	var terraceRoute;
	var zoologicoRoute;

	//[communication & updates]
	var socket;
	var trolleyUpdates = []; //last update from e/a trolley

	
	//Initialize
	
	function initialize() {
		// The map... duh!
		map = new google.maps.Map(TT.el.mapCanvas, mapOptions);

		//Symbols to be attached to routes
		setupDemoSymbols();
		
		//Sets routes and their UI controls
		setupRoutes();

		//Display trolley stops on map and
		//add click listeners for centering
		setupBusStopMarkers();

		//Setup InfoBox for bus stop markers
		setupInfoBox();		

		//Animate demo symbols in e/a route
		animateSymbol(palacioRoute);
		animateSymbol(internoRoute);
		animateSymbol(terraceRoute);
		animateSymbol(darlingtonRoute);
		animateSymbol(zoologicoRoute);	
	}

	
	//Functions
	
	function setupRoutes() {
		palacioRoute = new google.maps.Polyline({
			visible : false,
			path : Palacio,
			strokeColor : '#FF0000',
			strokeOpacity : 0.6,
			strokeWeight : 10,
			icons : [{
				icon : route1Symbol,
				offset : '100%'
			}],
			map : map
		});

		internoRoute = new google.maps.Polyline({
			path : Interno,
			strokeColor : '#FFFF00',
			strokeOpacity : 0.6,
			strokeWeight : 10,
			icons : [{
				icon : route2Symbol,
				offset : '100%'
			}],
			map : map
		});

		terraceRoute = new google.maps.Polyline({
			visible : false,
			path : Terrace,
			strokeColor : '#FF00FF',
			strokeOpacity : 0.6,
			strokeWeight : 10,
			icons : [{
				icon : route3Symbol,
				offset : '100%'
			}],
			map : map
		});

		darlingtonRoute = new google.maps.Polyline({
			visible : false,
			path : Darlington,
			strokeColor : '#00FF00',
			strokeOpacity : 0.6,
			strokeWeight : 10,
			icons : [{
				icon : route4Symbol,
				offset : '100%'
			}],
			map : map
		});

		zoologicoRoute = new google.maps.Polyline({
			visible : false,
			path : Zoologico,
			strokeColor : '#00FFFF',
			strokeOpacity : 0.6,
			strokeWeight : 10,
			icons : [{
				icon : route5Symbol,
				offset : '100%'
			}],
			map : map
		});

		// Create divs for the user to control visibility of routes
		setupUIControls();
	}

	function setupUIControls() {
		//Div to hold controls
		var controlDiv = document.createElement('div');

		var palacioRouteControl = new RouteControl(controlDiv, map, 'Click to toggle Route 1 visibility', 'Palacio', palacioRoute);
		var internoRouteControl = new RouteControl(controlDiv, map, 'Click to toggle Route 2 visibility', 'Interno', internoRoute);
		var terraceRouteControl = new RouteControl(controlDiv, map, 'Click to toggle Route 3 visibility', 'Terrace', terraceRoute);
		var darlingtonRouteControl = new RouteControl(controlDiv, map, 'Click to toggle Route 4 visibility', 'Darlington', darlingtonRoute);
		var zoologicoRouteControl = new RouteControl(controlDiv, map, 'Click to toggle Route 5 visibility', 'Zoologico', zoologicoRoute);
		var defaultViewControl = new DefaultViewControl(controlDiv, map, initCenter);

		// TODO: Find out what's this for.
		controlDiv.index = 1;
				
		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
	}

	function setupBusStopMarkers() {

		var busStopIcon = 'images/icons-simple/busstop.png';

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.205942, -67.136433),
			title : "Palacio",
			icon : busStopIcon
		}));

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.210868, -67.139643),
			title : "Puente Fisica",
			icon : busStopIcon
		}));

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.211787, -67.14196),
			title : "Biblioteca",
			icon : busStopIcon
		}));

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.211283, -67.140823),
			title : "Patio Central",
			icon : busStopIcon
		}));

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.216771, -67.143049),
			title : "Administracion de Empresas",
			icon : busStopIcon
		}));

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.21458, -67.139772),
			title : "Ingenieria Civil",
			icon : busStopIcon
		}));

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.20968, -67.139021),
			title : "Stefani",
			icon : busStopIcon
		}));

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.208957, -67.140322),
			title : "Portico",
			icon : busStopIcon
		}));

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.207543, -67.139935),
			title : "Barcelona",
			icon : busStopIcon
		}));

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.208648, -67.141432),
			title : "Asistencia Economica",
			icon : busStopIcon
		}));

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.209935, -67.141472),
			title : "Centro de Estudiantes",
			icon : busStopIcon
		}));

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.211064, -67.144672),
			title : "Entrada Principal",
			icon : busStopIcon
		}));

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.205683, -67.146185),
			title : "Darlington",
			icon : busStopIcon
		}));

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.212119, -67.143776),
			title : "Gimnasio",
			icon : busStopIcon
		}));

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.215461, -67.146341),
			title : "Finca Alzamora",
			icon : busStopIcon
		}));

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.215375, -67.14802),
			title : "Parque Terrace",
			icon : busStopIcon
		}));

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.210638, -67.143591),
			title : "Pinero",
			icon : busStopIcon
		}));

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.217306, -67.144844),
			title : "Registrador",
			icon : busStopIcon
		}));

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.211762, -67.138246),
			title : "Biologia",
			icon : busStopIcon
		}));

		markers.push(new google.maps.Marker({
			position : new google.maps.LatLng(18.215813, -67.133396),
			title : "Zoologico",
			icon : busStopIcon
		}));

		// display 'em
		markers.forEach(function(marker) {
			marker.setMap(map);
			addMarkerListener(map, marker);
		});
	}

	function setupInfoBox() {
		//What is the box going to show?
		// TT.el.infoBox.innerHTML = "Hello";		
		var infobox = new InfoBox({
			content : TT.el.infoBox,
			disableAutoPan : false,
			maxWidth : 150,
			pixelOffset : new google.maps.Size(-140, 0),
			zIndex : null,
			boxStyle : {
				background : "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
				opacity : 0.75,
				width : "280px"
			},
			closeBoxMargin : "12px 4px 2px 2px",
			closeBoxURL : "http://www.google.com/intl/en_us/mapfiles/close.gif",
			infoBoxClearance : new google.maps.Size(1, 1)
		});
		
		markers.forEach(function(marker) {
			google.maps.event.addListener(marker, 'click', function() {
				infobox.open(map,this);
				map.panTo(marker.getPosition());
			});
		});		
	}

	function setupDemoSymbols() {
		route1Symbol = {
			path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
			scale : 5,
			strokeColor : '#000000',
			strokeWeight : 2,
			fillOpacity : 1,
			fillColor : '#FF0000'
		};

		route2Symbol = {
			path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
			scale : 5,
			strokeColor : '#000000',
			strokeWeight : 2,
			fillOpacity : 1,
			fillColor : '#FFFF00'
		};

		route3Symbol = {
			path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
			scale : 5,
			strokeColor : '#000000',
			strokeWeight : 2,
			fillOpacity : 1,
			fillColor : '#FF00FF'
		};

		route4Symbol = {
			path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
			scale : 5,
			strokeColor : '#000000',
			strokeWeight : 2,
			fillOpacity : 1,
			fillColor : '#00FF00'
		};

		route5Symbol = {
			path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
			scale : 5,
			strokeColor : '#000000',
			strokeWeight : 2,
			fillOpacity : 1,
			fillColor : '#00FFFF'
		};
	}

	//Wait until whole page is loaded, then initialize
	//gmaps map and communication through websockets
	window.onload = function() {
		//Attach element listeners

		//Initialize gmaps
		initialize();

		//Connect to socket.io and store connection
		socket = io.connect(window.location.origin);

		//Subscribe to mapUpdates events through socket.io
		if (socket !== undefined) {
			socket.on('mapUpdate', function(update) {
				var upd = JSON.parse(update);
				applyUpdate(map, trolleyUpdates, upd);

				console.log(upd); //Debug
			});
		}
	};
})(trolleyTracker, jQuery);

