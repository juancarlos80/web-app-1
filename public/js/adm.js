var equipos;
var niveles;

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
    $("#loader").fadeOut();            
  });      
  
  $("#btn_nuevo").click( function (){
    $("#main_container").fadeOut();
    $("#loader").fadeIn();
    $.get('/adm/nuevo_partido', function(response) {
      $("#main_container").html(response);
      init_nuevo_partido();
    });
  });
  
}

function init_nuevo_partido(){
  $(".form_datetime").datetimepicker({
    format: "yyyy-mm-dd hh:ii",
    autoclose: 1
  });
  
  $.get('/adm/get_partido_data', function(response) {
    equipos = response.equipos;
    niveles = response.niveles;
    
    $.each(equipos, function() {
      $("#equipo_1").append($("<option />").val(this.nombre).text(this.nombre));
      $("#equipo_2").append($("<option />").val(this.nombre).text(this.nombre));      
    });
    
    $.each(niveles, function() {
      $("#nivel").append($("<option />").val(this).text(this));
    });
    
    $("#equipo_1, #equipo_2").change( function (){
      $("#alert_registro").fadeOut();
    });
    
    $("#main_container").fadeIn();
    $("#loader").fadeOut();
  });
  
  
  $('form').submit(function(event) {    
    event.preventDefault();
    if( $("#equipo_1").val() == $("#equipo_2").val() ){
      $("#txt_alert").html("Un partido no puede jugarse con un mismo equipo");
      $("#alert_registro").fadeIn();
      return false;
    }            
    
    var partido = {
      equipo_1: $("#equipo_1").val(),
      equipo_2: $("#equipo_2").val(),
      fecha: $("#fecha").val(),
      nivel: $("#nivel").val()
    };        
    
    $.post('/adm/set_partido?' + $.param({partido: partido}) , function(response) {
       if( response.success ){
         window.location.href = '/adm';
       } else {
         $("#alert_login").fadeIn();
       }
    });
  });
  
}      