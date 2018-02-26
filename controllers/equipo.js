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

module.exports.set_equipo = (client_db, request, equipo, response) => {	                 
  var path = require('path'),fs = require('fs');
  fs.exists(request.files.file.path, (existe) => {
    if( !existe ){
      response.send({success: false, message: "El archivo no se subio al servidor"});
      return;
    }
    
    var tempPath = request.files.file.path;      
    var dir_banderas = "img/banderas/";     
    var url_bandera = dir_banderas+request.files.file.name;
    var targetPath = path.resolve( "public/"+url_bandera );

    fs.exists(targetPath, (existe) => {
      if( existe ){
        response.send({success: false, message: "Ya existe una imagen con ese nombre"});
        return;
      }      
      console.log(request.files);

      if (path.extname(request.files.file.name).toLowerCase() === '.png' ||
              path.extname(request.files.file.name).toLowerCase() === '.jpg' ||
              path.extname(request.files.file.name).toLowerCase() === '.jpeg') {
          fs.createReadStream(tempPath).pipe(fs.createWriteStream(targetPath));
          request.query.equipo.url_bandera = url_bandera;
            
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
      } else {
        fs.unlink(tempPath, function (err) {
            if (err) throw err;              
        });
        response.send({success: false, message: "Solo se pueden subir imagenes en las banderas"});
      } 
    });  
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

module.exports.del_equipo = (client_db, id_equipo, url_bandera, response) => {	                    
  var path = require('path'),fs = require('fs');
  var img_server = path.resolve( "public/"+url_bandera );
  fs.exists(img_server, (existe) => {
    if( existe ){
      fs.unlink(img_server, function (err) {
          if (err) { 
            console.log(err);
            response.send ( { success: false, message: "Error al eliminar el equipo" } );
            return;
          }              
          module.exports.del_equipo_db( client_db, id_equipo, response );
      });
    } else {
      module.exports.del_equipo_db( client_db, id_equipo, response );
    }  
  });
}
  
module.exports.del_equipo_db = (client_db, id_equipo, response) => {	                    
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