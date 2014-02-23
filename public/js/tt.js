<!DOCTYPE html>
<html>
	<head>
		<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
		<meta charset="utf-8">
		<title>UPRM Trolley Routes</title>
		<style>
			html, body, #map-canvas {
				height: 100%;
				margin: 0px;
				padding: 0px
			}
		</style>
		<link rel="stylesheet" type="text/css" href="css/layout.css">
		<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?libraries=geometry&sensor=false"></script>
		<script type="text/javascript" src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/src/infobox.js"></script>
		<script type="text/javascript" src="appjs/vars.js"></script>
		<script type="text/javascript" src="appjs/func.js"></script>		
		<script src="http://127.0.0.1:8080/socket.io/socket.io.js"></script>
		<script>
		
			try {
				// An io.socket to communicate with server
				var iosocket = io.connect("http://127.0.0.1:8080");
			} catch (e) {
				// Log error
				console.log(e);
			}
			
			if (iosocket !== undefined) {
				iosocket.on('mapUpdate', function(update){
					console.log("Update: " + update);
				});
			}
			

			function initialize() {
				//include vars.js
				
				// MAP PROPERTIES -------------------------------------------------------------------------------------
				var UPRM = new google.maps.LatLng(18.209438, -67.140543);
				
				var mapOptions = {
					zoom : 17,
					center : UPRM,
					mapTypeId : google.maps.MapTypeId.ROADMAP,
					disableDefaultUI : true
				};

				var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

				var opt = {
					minZoom : 16,
					maxZoom : 18
				};
				
				map.setOptions(opt);
				
				//ANIMATED SYMBOLS-------------------------------------------------------------------------------------
				var route1Symbol = {
					path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
					scale : 5,
					strokeColor : '#000000',
					strokeWeight : 2,
					fillOpacity : 1,
					fillColor : '#FF0000'
				};

				var route2Symbol  = {
					path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
					scale : 5,
					strokeColor : '#000000',
					strokeWeight : 2,
					fillOpacity : 1,
					fillColor : '#FFFF00'
				};

				var route3Symbol = {
					path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
					scale : 5,
					strokeColor : '#000000',
					strokeWeight : 2,
					fillOpacity : 1,
					fillColor : '#FF00FF'
				};

				var route4Symbol = {
					path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
					scale : 5,
					strokeColor : '#000000',
					strokeWeight : 2,
					fillOpacity : 1,
					fillColor : '#00FF00'
				};

				var route5Symbol = {
					path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
					scale : 5,
					strokeColor : '#000000',
					strokeWeight : 2,
					fillOpacity : 1,
					fillColor : '#00FFFF'
				};
				
				// ROUTE POLYLINES ------------------------------------------------------------------------------------
				var route1 = new google.maps.Polyline({
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

				var route2 = new google.maps.Polyline({
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

				var route3 = new google.maps.Polyline({
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

				var route4 = new google.maps.Polyline({
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

				var route5 = new google.maps.Polyline({
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
				
				// UI Controls ----------------------------------------------------------------------------------------
				var controlDiv = document.createElement('div');
				
				var route1Control = new RouteControl(controlDiv, map, 'Click to toggle Route 1 visibility', 'Palacio', route1);
				var route2Control = new RouteControl(controlDiv, map, 'Click to toggle Route 2 visibility', 'Interno', route2);
				var route3Control = new RouteControl(controlDiv, map, 'Click to toggle Route 3 visibility', 'Terrace', route3);
				var route4Control = new RouteControl(controlDiv, map, 'Click to toggle Route 4 visibility', 'Darlington', route4);
				var route5Control = new RouteControl(controlDiv, map, 'Click to toggle Route 5 visibility', 'Zoologico', route5);
				var defaultViewControl = new DefaultViewControl(controlDiv, map, UPRM);

				controlDiv.index = 1;
				map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);

				// TROLLEY MARKERS ------------------------------------------------------------------------------------
				var route2_trolley = new google.maps.Marker({
					position : interno_trolley[0],
					title : "interno_trolley"
				});
				
				// TROLLEY STOP MARKERS -------------------------------------------------------------------------------
				var busstop = 'images/icons-simple/busstop.png';
				
				var pala = new google.maps.Marker({
					position : new google.maps.LatLng(18.205942,-67.136433),
					title : "Palacio",
					icon: busstop
				});
				
				var fisi = new google.maps.Marker({
					position : new google.maps.LatLng(18.210868,-67.139643),
					title : "Puente Fisica",
					icon: busstop
				});
				
				var bibl = new google.maps.Marker({
					position : new google.maps.LatLng(18.211787,-67.14196),
					title : "Biblioteca",
					icon: busstop
				});
				
				var pati = new google.maps.Marker({
					position : new google.maps.LatLng(18.211283,-67.140823),
					title : "Patio Central",
					icon: busstop
				});
				
				var admi = new google.maps.Marker({
					position : new google.maps.LatLng(18.216771,-67.143049),
					title : "Administracion de Empresas",
					icon: busstop
				});
				
				var civi = new google.maps.Marker({
					position : new google.maps.LatLng(18.21458,-67.139772),
					title : "Ingenieria Civil",
					icon: busstop
				});
				
				var stef = new google.maps.Marker({
					position : new google.maps.LatLng(18.20968,-67.139021),
					title : "Stefani",
					icon: busstop
				});
				
				var port = new google.maps.Marker({
					position : new google.maps.LatLng(18.208957,-67.140322),
					title : "Portico",
					icon: busstop
				});
				
				var barc = new google.maps.Marker({
					position : new google.maps.LatLng(18.207543,-67.139935),
					title : "Barcelona",
					icon: busstop
				});
				
				var asis = new google.maps.Marker({
					position : new google.maps.LatLng(18.208648,-67.141432),
					title : "Asistencia Economica",
					icon: busstop
				});
				
				var cent = new google.maps.Marker({
					position : new google.maps.LatLng(18.209935,-67.141472),
					title : "Centro de Estudiantes",
					icon: busstop
				});
				
				var entr = new google.maps.Marker({
					position : new google.maps.LatLng(18.211064,-67.144672),
					title : "Entrada Principal",
					icon: busstop
				});
				
				var darl = new google.maps.Marker({
					position : new google.maps.LatLng(18.205683,-67.146185),
					title : "Darlington",
					icon: busstop
				});
				
				var gimn = new google.maps.Marker({
					position : new google.maps.LatLng(18.212119,-67.143776),
					title : "Gimnasio",
					icon: busstop
				});
				
				var finc = new google.maps.Marker({
					position : new google.maps.LatLng(18.215461,-67.146341),
					title : "Finca Alzamora",
					icon: busstop
				});
				
				var terr = new google.maps.Marker({
					position : new google.maps.LatLng(18.215375,-67.14802),
					title : "Parque Terrace",
					icon: busstop
				});
				
				var pine = new google.maps.Marker({
					position : new google.maps.LatLng(18.210638,-67.143591),
					title : "Pinero",
					icon: busstop
				});
				
				var regi = new google.maps.Marker({
					position : new google.maps.LatLng(18.217306,-67.144844),
					title : "Registrador",
					icon: busstop
				});
				
				var biol = new google.maps.Marker({
					position : new google.maps.LatLng(18.211762,-67.138246),
					title : "Biologia",
					icon: busstop
				});
				
				var zool = new google.maps.Marker({
					position : new google.maps.LatLng(18.215813,-67.133396),
					title : "Zoologico",
					icon: busstop
				});
				
				//var atle
				
				// OTHER FUNCS ----------------------------------------------------------------------------------------
				pala.setMap(map);
				fisi.setMap(map);
				bibl.setMap(map);
				pati.setMap(map);
				admi.setMap(map);
				civi.setMap(map);
				stef.setMap(map);
				port.setMap(map);
				barc.setMap(map);
				asis.setMap(map);
				cent.setMap(map);
				entr.setMap(map);
				darl.setMap(map);
				gimn.setMap(map);
				finc.setMap(map);
				terr.setMap(map);
				pine.setMap(map);
				regi.setMap(map);
				biol.setMap(map);
				zool.setMap(map);
				
				animateSymbol(route1);
				animateSymbol(route2);
				animateSymbol(route3);
				animateSymbol(route4);
				animateSymbol(route5);
				
				addMarkerListener(map,pala);
			    addMarkerListener(map,fisi);
			    addMarkerListener(map,bibl);
			    addMarkerListener(map,pati);
			    addMarkerListener(map,admi);
			    addMarkerListener(map,civi);
			    addMarkerListener(map,stef);
			    addMarkerListener(map,port);
			    addMarkerListener(map,barc);
			    addMarkerListener(map,asis);
			    addMarkerListener(map,entr);
			    addMarkerListener(map,darl);
			    addMarkerListener(map,gimn);
			    addMarkerListener(map,finc);
			    addMarkerListener(map,terr);
			    addMarkerListener(map,pine);
			    addMarkerListener(map,regi);
			    addMarkerListener(map,biol);
			    addMarkerListener(map,zool);
				
				route2_trolley.setMap(map);
				
				//animateMarker(route2_trolley,interno_trolley,route2);
				animateMarker(route2_trolley,interno_trolley,route2,fisi.getPosition());
				
				var mymarker = new google.maps.Marker({
					position : new google.maps.LatLng(18.2088,-67.1440),
					draggable : true
				});
				
				//draggable marker and auto marker on closest point in route
				//mymarker.setMap(map);
				//markerDropListener(mymarker,interno_trolley,map);
						
				// INFOBOX --------------------------------------------------------------------------------------------
				var infobox = new InfoBox({
			         content: document.getElementById("infobox"),
			         disableAutoPan: false,
			         maxWidth: 150,
			         pixelOffset: new google.maps.Size(-140, 0),
			         zIndex: null,
			         boxStyle: {
			            background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
			            opacity: 0.75,
			            width: "280px"
			        },
			        closeBoxMargin: "12px 4px 2px 2px",
			        closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
			        infoBoxClearance: new google.maps.Size(1, 1)
			    });
			    
			    google.maps.event.addListener(cent, 'click', function() {
			        infobox.open(map, this);
			        map.panTo(cent.getPosition());
			    });
			        
			}

			google.maps.event.addDomListener(window, 'load', initialize);

		</script>
	</head>
	<body>
		<div id="map-canvas"></div>
		<div class="infobox-wrapper">
		    <div id="infobox">
		        <b><u>Centro de Estudiantes</b></u><br/>Terrace<br/>Interno
		    </div>
		</div>
	</body>
</html>