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

module.exports.upd_equipo = (client_db, equipo, response) => {	                 
  var equipo_db = client_db.db("test").collection('equipos');        

  equipo_db.update({_id:equipo._id}, equipo, function (err, equi) {
     if(err) {
       console.log(err);         
       response.send ( { success: false, message: "Error al actualizar el equipo" } );
     } else {
       console.log("Equipo actualizado");
       response.send ( { success: true, equipo: equi } );
     }       
  });                                     
};

module.exports.del_equipo = (client_db, id_equipo, response) => {	                 
  var equipo_db = client_db.db("test").collection('equipos');        

  equipo_db.deleteOne({_id:id_equipo}, function (err, res) {    
     if(err) {
       console.log(err);         
       response.send ( { success: false, message: "Error al eliminar el equipo" } );
     } else {
       console.log("Equipo Eliminado");       
       response.send ( { success: true } );
     }       
  });                                     
};