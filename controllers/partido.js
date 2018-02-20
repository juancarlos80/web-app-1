
module.exports.get_partidos_nivel = (client_db, nivel, response) => {
	           
    var partidos = client_db.db("test").collection('partidos');        
  
    partidos.find({ nivel : { $eq: nivel } }).toArray(function (err, docs) {
       if(err) {
         console.log(err);
         response.send( { success: false, message: "Ocurrio errores en la busqueda" } );
       }                           
      
       /*docs.forEach(function (doc) {
         console.log(
              'El equipo ' + doc['equipo_1'] + ' anoto ' + doc['goles_e1'] + ' goles '
            );            
       });*/             
      
       response.send ( { success: true, partidos: docs } );
    });                                     
};