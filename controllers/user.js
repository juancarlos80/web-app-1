module.exports.login_user_pass = (client_db, user, pass, request, response) => {	           
    var usuarios = client_db.db("test").collection('users');        
  
    usuarios.findOne({ usuario : { $eq: user }, clave: { $eq: pass} }, function (err, user) {
    //usuarios.find({}).toArray(function(err, user) {  
       if(err) {
         console.log(err);
         response.send( { success: false, message: "Ocurrio errores en la conexion del servidor" } );
       }
      
       if( user == null ){
         request.session.usuario = null;
          response.send( { success: false, message: "Los datos no son correctos" });
       } else {
         request.session.usuario = user;
         response.send( { success: true });
       }             
    });                                     
};

module.exports.insert_user_adm = (client_db, user_adm) => {	           
    
    var usuarios = client_db.db("test").collection('users');        
  
    usuarios.insertOne(user_adm, function (err, user) {
       if(err) {
         console.log(err);
         
       }                                              
       console.log("Nuevo usuario insertado");
    });                                     
};

