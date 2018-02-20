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