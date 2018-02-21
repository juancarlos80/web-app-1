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
    nombre: 'Brasil',
    nombre_corto: 'bra',
    url_bandera: 'banderas/bar.jpg',
    grupo: 'B'
  },
  {
    nombre: 'Colombia',
    nombre_corto: 'col',
    url_bandera: 'banderas/col.jpg',
    grupo: 'C'
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
     console.log('process.env.URL_MONGO_DB: '+process.env.URL_MONGO_DB);
     //console.log("---------------------------------");
     //console.log( c_partido.get_partidos_nivel(client_db, "Inicial"));  
   });  
  
  
  
   /******************* Adm functions ************/

   var user_adm = {
      nombre: 'Administrador',
      usuario: 'admin',
      clave: 'wkx_1234567',
      email: 'juancarlos.crespo@wiserkronox.com',
      register_date: new Date()
    }
   //c_user.insert_user_adm( client_db, user_adm);
  
  
});

app.get("/partidos", function (request, response) {    
  c_partido.get_partidos_nivel(client_db, "Inicial", response);  
});

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
  //response.send ( { success: true, user: request.query.user, pass: request.query.pass } );  
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




