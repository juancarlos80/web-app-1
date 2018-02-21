function init_login(){
  $('form').submit(function(event) {
    event.preventDefault();
    var user = $('#inputUsuario').val();
    var pass = $('#inputPassword').val();
    
    $.post('/login_adm?' + $.param({user: user, pass: pass}) , function(response) {
       if( response.success ){
         window.location.href = 'adm';
       } else {
         $("#alert_login").fadeIn();
       }
    });
  });
}

function init_partidos(){      
    
  //Primero cargamos los partidos en el dashboard  
  $.get('/partidos', function(response) {        
    if( response.success ){
        let count = 1;
        response.partidos.forEach(function(partido) {      
            //div_partidos += "<div class='col-sm'>"+partido.fecha+"</div>";        
            $('#table_partidos tr:last').after("<tr>"+
                    "<td>"+count+"</td>"+
                    "<td>"+partido.equipo_1+"</td>"+
                    "<td>"+partido.equipo_2+"</td>"+
                    "<td>"+partido.fecha+"</td>"+
                    "</tr>");
            count++;
      });
    } else {
      $('#table_partidos').empty();
    }            
    $("#loader_partidos").fadeOut();
  });
}