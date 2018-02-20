// The main functions of the front-end app 

function init_app() {
  console.log('Init aplication v3');
  
  $.get('/partidos', function(response) {
    var div_partidos = "<div class='row text-center'>";
    
    if( response.success ){
      response.partidos.forEach(function(partido) {      
        div_partidos += "<div class='col-sm'>"+partido.fecha+"</div>";
      });
    } else {
      div_partidos += "No se pudieron obtener los partidos";
    }
    div_partidos += "</div>";
    
    $("#main_container").html( div_partidos );    
  });
  
}
