
var array=[];

	
$(document).ready(function(){
var q=0;
var map;
var busqueda=[];
var colecciones=[]
var nombrecolecciones=[]
var idColecciones=[]
var jsonInitData;
var usuariosExistentes=[]
var posicionBuscar;
var nombreFicha;
var userscoleccion=[]

var uploadJson;

	var apiKey = 'AIzaSyAZcepi0nfTuDHmfS0pvKDLTaQGP2irVG8';
	function funcusuarios(arrayusers){
		handleClientLoad(arrayusers);
	}
	// Use a button to handle authentication the first time.
	function handleClientLoad(arrayusers) {
		gapi.client.setApiKey(apiKey);
		makeApiCall(arrayusers);
	}
	// Load the API and make an API call.  Display the results on the screen.
	function makeApiCall(arrayusers) {
	gapi.client.load('plus', 'v1', function() {
	var request = gapi.client.plus.people.get({
	    'userId': arrayusers,
	  });
	  request.execute(function(resp) {
		var existe=false;
		var n=resp["displayName"];
		for (i=0;i<usuariosExistentes.length;i++){
			if(n==usuariosExistentes[i]){
				existe=true;				
				break;
			}
		}

		if(!existe){
		usuariosExistentes.push(n)
		$("#Usuario").append("<p class='draggable' data-id="+arrayusers+">"+n+"<p>"); 
		  $( function() {
		    $( ".draggable" ).draggable({
			 	helper:"clone",
				appendTo:"body"
			});

		  } );
		}

	  });
	 });
	}

$('#uploadFile1').click(function(){

	var Fich=$('#NombreFichero').val();
	var gh=new Github("jorgevelap","AT");
	var repo=gh.getRepo("jorgevelap","AT");
	repo.read('master',Fich,function(e,data){
		//console.log(data)
		console.log("COLECCIONES")
		var objJson=JSON.parse(data);
		for(i=0;i<objJson["Colecciones"].length;i++){
			valor=objJson["Colecciones"][i]["Parking"+i][0]["Nombre"];
			nombrecolecciones.push(valor)
			p=valor;
			valor=[];
			colecciones.push(valor);
			var posicion=colecciones.length-1;
			$("#ListasCreadas").append("<div class='droppable' id='widget-droppable' data-id='"+posicion+"'><p>Coleccion: "+objJson["Colecciones"][i]["Parking"+i][0]["Nombre"]+"</p></div>")
			$( function() {					
				$( ".droppable" ).droppable({
					drop: function( event, ui ) {
					idColecciones.push(ui.draggable[0]["id"])
					colecciones[$(this).data("id")].push(array[ui.draggable[0]["id"]])
					$( this )
						.addClass( "ui-state-highlight" )
						.find( "p" )
						.html("<p>Coleccion: "+p+"</p><br><p> Añadido: "+array[ui.draggable[0]["id"]]["titulo"]+"</p>");
					}
				});

				$('.droppable').click(function (evt) {
					for (i = 0; i < nombrecolecciones.length; i++) {
						if(nombrecolecciones[i]==nombrecolecciones[$(this).data("id")]){
							$("#Seleccionado").html("");
							$("#NombreColeccion").html("Colección: "+nombrecolecciones[i]);
							$("#home2_3").remove()
							$("#home2_2").append("<div id='home2_3' class='col-md-12'></div>");
							$("#home2_3").html("<p id='coleccion'>"+"COLECCIÓN SELECCIONADA"+"</p><br>");
							for(j = 0; j < colecciones[i].length; j++) {
								$("#Seleccionado").append("<p>"+colecciones[i][j]["titulo"]+"</p><br>");
								$("#home2_3").append("<p class='btn' data-id="+idColecciones[j]+">"+colecciones[i][j]["titulo"]+"</p><br>");
							}
						break;
						}

					};
				});
			} );


			//console.log(objJson["Colecciones"][i]["Parking"+i][0]["Nombre"])
			for(j=0;j<objJson["Colecciones"][i]["Parking"+i][1]["Datos"].length;j++){
				for(l in jsonInitData){
					if (jsonInitData[l]["title"]==objJson["Colecciones"][i]["Parking"+i][1]["Datos"][j]){
						idColecciones.push(l)
						colecciones[posicion].push(array[l])
					}
				}
				console.log(objJson["Colecciones"][i]["Parking"+i][1]["Datos"][j])
			}
		}

		console.log("LISTAS")


		for(i=0;i<objJson["Seguidas"].length;i++){
		        var posicionBuscar;
			var existe=0
			for (i = 0; i < userscoleccion.length; i++) {
				if(userscoleccion[i][0]==objJson["Seguidas"][i]["Lista"+i][0]["Nombre"]){
					existe=1;
					posicionBuscar= i;

						for(j=1;j<userscoleccion[posicionBuscar].length;j++){
							$('#Seguidores').append('<p>'+userscoleccion[posicionBuscar][j]+'</p>');
						}
					break;
				}
			}

			if(existe==0){
				userscoleccion.push(objJson["Seguidas"][i]["Lista"+i][0]["Nombre"]);
				posicionBuscar= userscoleccion.length-1;
				userscoleccion[posicionBuscar]=[];
				userscoleccion[posicionBuscar].push(objJson["Seguidas"][i]["Lista"+i][0]["Nombre"]);
			}


			//console.log(objJson["Seguidas"][i]["Lista"+i][0])
			for(j=0;j<objJson["Seguidas"][i]["Lista"+i][1]["Datos"].length;j++){
				userscoleccion[posicionBuscar].push(objJson["Seguidas"][i]["Lista"+i][1]["Datos"][j]);
				$('#Seguidores').append('<p>'+objJson["Seguidas"][i]["Lista"+i][1]["Datos"][j]+'</p>');
				console.log(objJson["Seguidas"][i]["Lista"+i][1]["Datos"][j])
			}
		}
		//console.log(objJson["Colecciones"])
	});


});

$('#uploadFile').click(function(){
	var token=$('#texto1').val();
	var nameRepo=$('#texto2').val();
	var Fich=$('#texto3').val();

	var gh= new Github({
		token: token,
		auth: "oauth"
	})
	console.log(token)
	console.log(nameRepo)
	console.log(Fich)
	var repo=gh.getRepo("jorgevelap",nameRepo);

	console.log(uploadJson)
	repo.write('master', Fich,uploadJson,"Upload",function(err){
		console.log(err);

	});

});

$("#myBtn").click(function(){
	
	
	var json= '{"Colecciones":['
	for(i=0;i<nombrecolecciones.length;i++){
		json=json+ '{"Parking'+i+'":['
		json=json+'{"Nombre":"'+nombrecolecciones[i]+'"},{"Datos":['
		for(j=0;j<colecciones[i].length;j++){	
			json=json+'"'+colecciones[i][j]["titulo"]+'"'  // console.log(colecciones[i][j]["titulo"]);
			//json=json+'{"Parking":"'+colecciones[i][j]["titulo"]+'"}'  // console.log(colecciones[i][j]["titulo"]);
			if(j!= colecciones[i].length-1){
				json=json+','
			}else{
				json=json+']}'
			}
		}
		if(nombrecolecciones.length-1==i){
			json=json+']'
		}else{
			json=json+']},'
		}	
	}
	json=json+'}]'

	

	json=json+',"Seguidas":['
	for(i=0;i<userscoleccion.length;i++){
		json=json+ '{"Lista'+i+'":['
		json=json+'{"Nombre":"'+userscoleccion[i][0]+'"},{"Datos":['
		for (j=1;j<userscoleccion[i].length;j++){
			json=json+'"'+userscoleccion[i][j]+'"'  
			if(j!= userscoleccion[i].length-1){
				json=json+','
			}else{
				json=json+']}'
			}
		}
		if(userscoleccion.length-1==i){
			json=json+']'
		}else{
			json=json+']},'
		}	
	}

	json=json+'}]}'
	uploadJson=json;

});

$("#Principal").click(function(){
	$('#colections').hide(1500);
	$('#intstalations').hide(1500);
	$('#main_cont').show(1500);
});


$("#Instalaciones").click(function(){
	var existe=0;
	$('#Seguidores').html('<p>SEGUIDORES</p>')
	for (i = 0; i < userscoleccion.length; i++) {
		if(userscoleccion[i][0]==nombreFicha){
			existe=1;
			posicionBuscar= i;
				for(j=1;j<userscoleccion[posicionBuscar].length;j++){
					$('#Seguidores').append('<p>'+userscoleccion[posicionBuscar][j]+'</p>');
				}
			break;
		}
	}
	
	if(existe==0){
		userscoleccion.push(nombreFicha);
		posicionBuscar= userscoleccion.length-1;
		userscoleccion[posicionBuscar]=[]
		userscoleccion[posicionBuscar].push(nombreFicha)
	}
	$('#colections').hide(1500);
	$('#main_cont').hide(1500);
	$('#intstalations').show(1500);
});

$("#Colecciones").click(function(){
	$('#main_cont').hide(1500);
	$('#intstalations').hide(1500);
	$('#colections').show(1500);
});



$( function() {
	$( "#droppable" ).droppable({
		drop: function( event, ui ) {
                console.log(array[ui.draggable[0]["id"]])  
                colecciones[0].push(array[ui.draggable[0]["id"]])
                console.log(colecciones[0])
		$( this )
			  .addClass( "ui-state-highlight" )
			  .find( "p" )
			  .html( "Dropped!" );
		}
	});
} );

$(".btnGoogle").click(function(){
	var arrayusers=[];
	try {

		var host = "ws://127.0.0.1:80";
		console.log("Host:", host);
		var s = new WebSocket(host);
		
		s.onopen = function (e) {
			console.log("Socket opened.");
		};
		
		s.onclose = function (e) {
			console.log("Socket closed.");
		};
		
		s.onmessage = function (e) {
			arrayusers.push(e.data)
			funcusuarios(e.data)
		};
		
		s.onerror = function (e) {
			console.log("Socket error:", e);
		};
		
	} catch (ex) {
		console.log("Socket exception:", ex);
	}

});

		$("#Google").append("<div class='droppable2' id='widget-droppable'><p>Coleccion:</p></div>")
		$( function() {
			$( ".droppable2" ).droppable({
				drop: function( event, ui ) {

				var add=true;
				for(j=1;j<userscoleccion[posicionBuscar].length;j++){
					if(userscoleccion[posicionBuscar][j]==(ui.draggable["context"]["firstChild"]["data"])){
						add=false;
						break;
					}
				}
				if(add){
					userscoleccion[posicionBuscar].push(ui.draggable["context"]["firstChild"]["data"]);
					$('#Seguidores').append('<p>'+userscoleccion[posicionBuscar][j]+'</p>');
				}
				}
			});
		});


$("#nc").click(function(){
		var valor = document.getElementById("texto").value; 
		nombrecolecciones.push(valor)

		p=valor;
		valor=[]
		colecciones.push(valor)
		var posicion=colecciones.length-1;
		//$("#CHome2").append("<div id='droppable' class='ui-widget-header'><p>Drop here</p></div>")
		$("#ListasCreadas").append("<div class='droppable' id='widget-droppable' data-id='"+posicion+"'><p>Coleccion: "+p+"</p></div>")

		$( function() {
			$( ".droppable" ).droppable({
				drop: function( event, ui ) {

				console.log(ui.draggable[0]["id"])
				idColecciones.push(ui.draggable[0]["id"])
				//console.log(array[ui.draggable[0]["id"]]["titulo"])  
				colecciones[$(this).data("id")].push(array[ui.draggable[0]["id"]])
				console.log(colecciones)
				$( this )
					.addClass( "ui-state-highlight" )
					.find( "p" )
					.html("<p>Coleccion: "+p+"</p><p> -Añadido: "+array[ui.draggable[0]["id"]]["titulo"]+"</p>");
				}
			});

			$('.droppable').click(function (evt) {
				for (i = 0; i < nombrecolecciones.length; i++) {
					if(nombrecolecciones[i]==nombrecolecciones[$(this).data("id")]){
						$("#Seleccionado").html("");
						$("#NombreColeccion").html("Colección: "+nombrecolecciones[i]);
						$("#home2_3").remove()
						$("#home2_2").append("<div id='home2_3' class='col-md-12'></div>");
						$("#home2_3").html("<p id='coleccion'>"+"COLECCIÓN SELECCIONADA"+"</p><br>");
						for(j = 0; j < colecciones[i].length; j++) {
							$("#Seleccionado").append("<p>"+colecciones[i][j]["titulo"]+"</p><br>");
							$("#home2_3").append("<p class='btn' data-id="+idColecciones[j]+">"+colecciones[i][j]["titulo"]+"</p><br>");
						}
					break;
					}

				};
			});
		} );
	});


	$("#read").click(function(){
		$('#colections').hide(1500);
		$('#intstalations').hide(1500);
		$('#main_cont').show(1500);
		$("#home").html("");
		$.getJSON("archivo.json", function(data){
		//console.log(data);
		jsonInitData=data["@graph"];
		console.log(data["@graph"])
		for(l in data["@graph"]){
			var objeto={titulo:data["@graph"][l]["title"], calle:data["@graph"][l]["address"]["street-address"], CP:data["@graph"][l]["address"]["postal-code"], Location:data["@graph"][l]["location"], Description: data["@graph"][l]["organization"]["organization-desc"]};
		array.push(objeto);

		var content="<p class='btn' data-id="+l+">"+data["@graph"][l]["title"]+"</p><br>";
		var content2="<p class='draggable' id="+l+">"+data["@graph"][l]["title"]+"</p><br>";


		  $( function() {
		    $( ".draggable" ).draggable({
			 	helper:"clone",
				appendTo:"body"
			});
	
		  } );

		$("#home").prepend(content);
		$("#CHome").prepend(content2);
		}
		});
	});


	$(document).on("click", ".btn", function(){
		var id=$(this).data()
		console.log(array)

		nombreFicha=array[id.id]["titulo"];
		//instalacionElegida=array[id.id]["titulo"]
 		$('#home2_1_1').html("<p> Nombre: "+array[id.id]["titulo"]+"</p><br>"+"<p> Calle: "+array[id.id]["calle"]+"</p><br>"+"<p> Descripcion: "+array[id.id]["Description"]+"</p><br>");
		//+"</p><br>"+"<p> Codigo Postal: "+array[id.id]["CP"]+"</p><br>"+"<p> Localizacion: "+array[id.id]["Location"]["latitude"]+", "+ array[id.id]["Location"]["longitude"]

		$('#Selected').html("<p> Nombre: "+array[id.id]["titulo"]+"</p><br>"+"<p> Calle: "+array[id.id]["calle"]+"</p><br>"+"<p> Descripcion: "+array[id.id]["Description"]+"</p><br>")
	if(q==0){
		//q=1;
		map = L.map('mapid').setView([array[id.id]["Location"]["latitude"], array[id.id]["Location"]["longitude"]], 13);
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

	}
	q=1;
	var marker=L.marker([array[id.id]["Location"]["latitude"], array[id.id]["Location"]["longitude"]]);

	var x=$('<p>'+array[id.id]["titulo"]+'</p>').click(function(){
		map.removeLayer(marker);
	})[0];

	marker.addTo(map)
	    .bindPopup(x)
	    .openPopup();

	/*
	q=q+1;
	var m=L.marker([array[id.id]["Location"]["latitude"], array[id.id]["Location"]["longitude"]]).addTo(map)
	    .bindPopup('<a href="http://www.urjc.es">'+array[id.id]["titulo"]+'</a><br><button id="delete'+q+'">eliminar</button>')
	    .openPopup();

	var b='#'+'delete'+q;


	$(b).click(function(){
		map.removeLayer(m);
	});
	*/
	$.ajax({

	    // la URL para la petición
	    url : "https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=geosearch&ggsprimary=all&ggsnamespace=6&ggsradius=500&ggscoord="+array[id.id]['Location']['latitude']+"|"+array[id.id]['Location']['longitude']+"&ggslimit=10&prop=imageinfo&iilimit=1&iiprop=url&iiurlwidth=200&iiurlheight=200&callback=?",
	    // especifica si será una petición POST o GET
	    type : 'GET',
	 
	    // el tipo de información que se espera de respuesta
	    dataType : 'jsonp',
	 
	    // código a ejecutar si la petición es satisfactoria;
	    // la respuesta es pasada como argumento a la función
	    success : function(json) {
		$('.carousel-indicators').html('');
		$('.carousel-inner').html('');
		var img= json["query"]["pages"]
		var arrayimg=$.map(img, function(a){
			return a;
		});

		var y= '<li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>';
		$('.carousel-indicators').append(y);
		var y2='<div class="item active"> <img src="'+arrayimg[0].imageinfo[0].url+'" alt="...">  <div class="carousel-caption"> </div></div>'
		$('.carousel-inner').append(y2);
		for(l=1; l<arrayimg.length;l++){
			im=arrayimg[l].imageinfo[0].url;
			console.log(im);
   			var x= '<li data-target="#carousel-example-generic" data-slide-to="'+l+'" ></li>';
			$('.carousel-indicators').append(x);
			var x2='<div class="item"> <img src="'+arrayimg[l].imageinfo[0].url+'">  <div class="carousel-caption"> </div></div>'
			$('.carousel-inner').append(x2);
		}



	    },
	});
	});

	var modal2 = document.getElementById('myModal2');
	var btn2 = document.getElementById("myBtn2");

	var modal = document.getElementById('myModal');
	var btn = document.getElementById("myBtn");
	var span = document.getElementsByClassName("close")[0];

	btn2.onclick = function() {
	    modal2.style.display = "block";
	}
	btn2.onclick = function() {
	    modal2.style.display = "block";
	}


	btn.onclick = function() {
	    modal.style.display = "block";
	}

	span.onclick = function() {
	    modal.style.display = "none";
	    modal2.style.display = "none";
	}

	window.onclick = function(event) {
	    if (event.target == modal) {
		modal.style.display = "none";
	    }
	    if (event.target == modal2) {
		modal2.style.display = "none";
	    }
	}








});
