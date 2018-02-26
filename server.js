// init project
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var util = require('./controllers/util');
var c_partido = require('./controllers/partido');
var c_user = require('./controllers/user');
var c_equipo = require('./controllers/equipo');

const app = express();
app.use(session({
    secret: process.env.SESSION_TOKEN_MONGO, 
    resave: true,
    saveUninitialized: true}));
var app_session;
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {extended: true} ) );

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

app.use(express.static('public'));


app.get("/", function (request, response) {  
  response.sendFile(__dirname + '/views/index.html');
});

//Variables gloables
var equipos = null;
var niveles = ["Inicial", "Cuartos de Final", "Semifinal", "Tercer Lugar", "Primer Lugar"]; 
var grupos = ["A", "B", "C", "D"]; 

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
   //Only one insert equipos   
  /*var equipos_db = client_db.db("test").collection('equipos');        
  equipos_db.insert(equipos, function (err, equips) {
    if(err) {
       console.log(err);         
    } else {
      console.log("insertados");
      console.log(equips);
    }
  });*/     
  
  var equipos_db = client_db.db("test").collection('equipos');        
  
  equipos_db.find({}).toArray(function (err, equips) {
     if(err) {
       console.log(err);       
     }                           
     equipos = equips;       
  });                                     
  
});

app.get("/partidos", function (request, response) {    
  c_partido.get_partidos_nivel(client_db, "Inicial", response);  
});

/******************************************************************************************/
/******************************* Rutas para la administracion *****************************/
/******************************************************************************************/

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
    response.sendFile(__dirname + '/views/adm/nuevo_partido.html');  
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

//--------------------- Equipos --------------------------------
app.get("/equipos", function (request, response) {      
  response.send({success: true, equipos: equipos});  
});

app.get("/equipos_db", function (request, response) {  
  var equipos_db = client_db.db("test").collection('equipos');        
  
  equipos_db.find({}).toArray(function (err, equips) {
     if(err) {
       console.log(err);       
       response.send({success: false});
     }                           
     equipos = equips;       
     response.send({success: true, equipos: equipos});
  }); 
});

app.get("/adm/equipos", function (request, response) {
  app_session = request.session;
  
  if( app_session.usuario ){  
    response.sendFile(__dirname + '/views/adm/equipos.html');
  } else {
    response.redirect('/adm_login');
  }
});

app.get("/adm/get_equipo_data", function (request, response) {
  response.send({grupos: grupos});
});

app.get("/adm/nuevo_equipo", function (request, response) {  
    response.sendFile(__dirname + '/views/adm/nuevo_equipo.html');  
});

app.post("/adm/set_equipo", multipartMiddleware, function (request, response) {    
  app_session = request.session;   
    
  if( app_session.usuario ){  
    c_equipo.set_equipo(client_db, request, request.query.equipo, response);
  } else {    
    response.redirect('/adm_login');
  }                            
});

app.post("/adm/upd_equipo", function (request, response) {    
  app_session = request.session;
  
  if( app_session.usuario ){  
    request.query.equipo._id = new mongodb.ObjectId(request.query.equipo._id);
    c_equipo.upd_equipo(client_db, request.query.equipo, response);    
  } else {    
    response.redirect('/adm_login');
  }
});

app.post("/adm/del_equipo", function (request, response) {    
  app_session = request.session;
  
  if( app_session.usuario ){  
    console.log(request.query.equipo);    
    c_equipo.del_equipo(client_db, new mongodb.ObjectId(request.query.equipo._id), request.query.equipo.url_bandera, response);
  } else {    
    response.redirect('/adm_login');
  }
});
