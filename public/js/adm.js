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

/*--------------------------- Equipos --------------------------------------*/
var equipo_eli, equipo_edi;
var equipos;
function init_equipos(){      
      
  $.get('/equipos_db', function(response) {        
    if( response.success ){
        let count = 0;
        equipos = response.equipos;
        response.equipos.forEach(function(equipo) {      
            //div_partidos += "<div class='col-sm'>"+partido.fecha+"</div>";        
            $('#table_equipos tr:last').after("<tr>"+
                    "<td>"+(count+1)+"</td>"+
                    "<td>"+equipo.nombre+"</td>"+
                    "<td>"+equipo.nombre_corto+"</td>"+
                    "<td><img src='../"+equipo.url_bandera+"' class='img-thumbnail' alt='"+equipo.url_bandera+"' /></td>"+
                    "<td>"+equipo.grupo+"</td>"+
                    "<td><button data-id='"+count+"' class='btn btn-editar'>Editar</button></td>"+
                    "<td><button data-id='"+count+"' class='btn btn-eliminar' data-toggle='modal' data-target='#confirm-submit'>Eliminar</button></td>"+
                    "</tr>");
            count++;
      });
      
      $(".btn-editar").click( function (){
        equipo_edi = equipos[ $(this).data("id") ];
        $("#main_container").fadeOut();
        $("#loader").fadeIn();
        $.get('/adm/nuevo_equipo', function(response) {
          $("#main_container").html(response);
          init_nuevo_equipo();
        });
      });
      
      $(".btn-eliminar").click( function (){
        equipo_eli = equipos[ $(this).data("id") ];
        $("#msj_delete").html("Esta seguro de eliminar el equipo: <strong>"+equipo_eli.nombre+"</strong> y toda la informacion relacionada?");
      });
      
      $("#btn_delete").click( function (){
        $.post('/adm/del_equipo?' + $.param({equipo: equipo_eli}) , function(response) {
          if( response.success ){
            window.location.href = '/adm/equipos';
          } else {
            $("#txt_alert").html("No se pudo eliminar el equipo");
            $("#alert_registro").fadeIn();
          }
        });
      });
      
    } else {
      $('#table_equipos').empty();
    }            
    $("#loader").fadeOut();            
  });      
  
  $("#btn_nuevo").click( function (){
    $("#main_container").fadeOut();
    $("#loader").fadeIn();
    $.get('/adm/nuevo_equipo', function(response) {
      $("#main_container").html(response);
      init_nuevo_equipo();
    });
  });    
}
  
  
function init_nuevo_equipo(){    
  $.get('/adm/get_equipo_data', function(response) {
    grupos = response.grupos;    

    $.each(grupos, function() {
      $("#grupo").append($("<option />").val(this).text(this));      
    });   

    //Si es edicion poblamos los selects
    if( equipo_edi != null ){
      $("#nombre").val( equipo_edi.nombre );
      $("#nombre_corto").val( equipo_edi.nombre_corto );
      //$("#file").fadeOut();
      $("#file").remove();
      $("#img_bandera").attr("src", "../"+equipo_edi.url_bandera);
      $("#img_bandera").fadeIn();
      $("#grupo").val( equipo_edi.grupo );

      $("#btn_registrar").fadeOut();
      $("#btn_actualizar").fadeIn();
    }

    $("#main_container").fadeIn();
    $("#loader").fadeOut();
  });


  $('form').submit(function(event) {    
    event.preventDefault();      

    var equipo = {
      nombre: $("#nombre").val(),
      nombre_corto: $("#nombre_corto").val(),
      url_bandera: $("#url_bandera").val(),
      grupo: $("#grupo").val()
    };        

    if( equipo_edi == null ){      
      var data = new FormData();
      $.each(jQuery('#file')[0].files, function(i, file) {
        data.append('file', file );
      });
      
      //data.append('equipo', equipo);
      
      $.ajax({
        url: '/adm/set_equipo?'+$.param({equipo: equipo}),
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function(response) {
      //$.post('/adm/set_equipo?' + $.param({equipo: equipo}) , function(response) {
         if( response.success ){
           window.location.href = '/adm/equipos';
         } else {
           $("#txt_alert").html("No se pudo registrar el equipo: "+ response.message);
           $("#alert_registro").fadeIn();
         }
        }
      });
    } else {
      equipo._id = equipo_edi._id;
      equipo.url_bandera = equipo_edi.url_bandera;
      $.post('/adm/upd_equipo?' + $.param({equipo: equipo}) , function(response) {
         if( response.success ){
           window.location.href = '/adm/equipos';
         } else {
           $("#txt_alert").html("No se pudo actualizar el equipo");
           $("#alert_registro").fadeIn();
         }
      });
    }
  });      
}