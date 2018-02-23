module.exports.get_equipos = (cliente_db, response) => {  
  var equipos_db = client_db.db("test").collection('equipos');        
  
  equipos_db.find({}).toArray(function (err, equips) {
     if(err) {
       console.log(err);       
     }                           
     equipos = equips;  
     console.log(equipos);
  });                                     
};

module.exports.set_equipo = (client_db, equipo, response) => {	                 
  var equipo_db = client_db.db("test").collection('equipos');        

  equipo_db.insertOne(equipo, function (err, equi) {
     if(err) {
       console.log(err);         
       response.send ( { success: false, message: "Error al insertar el equipo" } );
     } else {
       console.log("Nuevo equipo insertado");
       response.send ( { success: true, equipo: equi } );
     }       
  });                                     
};