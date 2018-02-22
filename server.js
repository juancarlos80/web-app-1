// init project
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var util = require('./controllers/util');
var c_partido = require('./controllers/partido');
var c_user = require('./controllers/user');

const app = express();
app.use(session({
    secret: process.env.SESSION_TOKEN_MONGO, 
    resave: true,
    saveUninitialized: true}));
var app_session;
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {extended: true} ) );

app.use(express.static('public'));


app.get("/", function (request, response) {  
  response.sendFile(__dirname + '/views/index.html');
});


//Datos base de la app
var equipos = [
  {
    nombre: 'Argentina',
    nombre_corto: 'arg',
    url_bandera: 'banderas/arg.jpg',
    grupo: 'A'
  },
  {
    nombre: 'Bolivia',
    nombre_corto: 'Bol',
    url_bandera: 'banderas/bol.jpg',
    grupo: 'B'
  },
  {
    nombre: 'Brasil',
    nombre_corto: 'bra',
    url_bandera: 'banderas/bar.jpg',
    grupo: 'B'
  },
  {
    nombre: 'Colombia',
    nombre_corto: 'col',
    url_bandera: 'banderas/col.jpg',
    grupo: 'A'
  },  
  {
    nombre: 'Chile',
    nombre_corto: 'cli',
    url_bandera: 'banderas/cli.jpg',
    grupo: 'C'
  },  
  {
    nombre: 'Costa Rica',
    nombre_corto: 'cos',
    url_bandera: 'banderas/cos.jpg',
    grupo: 'B'
  },  
  {
    nombre: 'Ecuador',
    nombre_corto: 'ecu',
    url_bandera: 'banderas/ecu.jpg',
    grupo: 'A'
  },  
];

var niveles = ["Inicial", "Cuartos de Final", "Semifinal", "Tercer Lugar", "Primer Lugar"]; 

/*var partidos_data = [
  {
    fecha: '2018-02-20',
    equipo_1: 'Bolivia',
    equipo_2: 'Argentina',
    goles_e1: 1,
    goles_e2: 0,
    grupo_e1: "A",
    grupo_e2: "B",
    nivel: "Inicial"
  },
  {
    fecha: '2018-02-21',
    equipo_1: 'Alemania',
    equipo_2: 'Brasil',    
    grupo_e1: "C",
    grupo_e2: "B",
    nivel: "Inicial"
  },
  {
    fecha: '2018-02-22',
    equipo_1: 'Francia',
    equipo_2: 'EEUU',
    goles_e1: 0,
    goles_e2: 0,
    grupo_e1: "F",
    grupo_e2: "D",
    nivel: "Inicial"
  },
  {
    fecha: '2018-02-23',
    equipo_1: 'Uruguay',
    equipo_2: 'Perú',    
    grupo_e1: "B",
    grupo_e2: "B",
    nivel: "Inicial"
  }
];*/
var client_db;

//Conecct to the database
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(process.env.URL_MONGO_DB, function(err, client) {
   if(err) throw err;
   client_db = client;
  
  
   var listener = app.listen( process.env.PORT_MONGO, function () {
     console.log('Running on port ' + listener.address().port);       
   });  
  
  
  
   /******************* Adm functions ************/
     
});

app.get("/partidos", function (request, response) {    
  c_partido.get_partidos_nivel(client_db, "Inicial", response);  
});


/***************** Rutas para la administracion *****************************/

app.get("/adm_login", function (request, response) {
  response.sendFile(__dirname + '/views/adm/login.html');
});

app.get("/adm", function (request, response) {
  app_session = request.session;
  
  if( app_session.usuario ){  
    response.sendFile(__dirname + '/views/adm/index.html');
  } else {
    response.redirect('/adm_login');
  }
});

app.post("/login_adm", function (request, response) {    
  c_user.login_user_pass(client_db,request.query.user, request.query.pass, request, response);
});

app.get("/logout", function (request, response) {  
   request.session.destroy(function(err) {
     if(err) {
       console.log(err);
       response.send({success: false});
     } else {
       response.send({success: true});
     }
  }); 
});

app.get("/adm/nuevo_partido", function (request, response) {
  //app_session = request.session;
  
  //if( app_session.usuario ){  
    response.sendFile(__dirname + '/views/adm/nuevo_partido.html');
  /*} else {    
    response.redirect('/adm_login');
  }*/
});

app.get("/adm/get_partido_data", function (request, response) {
  response.send({equipos: equipos, niveles: niveles});
});

app.post("/adm/set_partido", function (request, response) {    
  app_session = request.session;
  
  if( app_session.usuario ){  
    c_partido.set_partido(client_db, request.query.partido, response);
  } else {    
    response.redirect('/adm_login');
  }
});


