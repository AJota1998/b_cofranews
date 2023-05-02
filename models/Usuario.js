const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var Espacio = require("../models/Espacio");

var Usuario = new Schema({
  nombre: { type: String, required: true },
  nombreUsuario: { type: String, required: true, unique: true, minlength: 4, maxlength: 12 },
  correoElectronico: { type: String, required: true },
  contrasena: { type: String, required: true },
  imgPerfil: { type: String },
  rol: { type: String, enum: ['Administrador', 'General'], required: true },
  espacios: [{ type: Schema.ObjectId, ref: "Espacio" }]
});

Usuario.pre('save',function(next){
  var usuario = this;
  // solo aplica una función hash al password si ha sido modificado (o es nuevo)
  if (!usuario.isModified('contrasena')) return next();
  // genera la salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);
      // aplica una función hash al password usando la nueva salt
      bcrypt.hash(usuario.contrasena, salt, function(err, hash) {
          if (err) return next(err);
          // sobrescribe el password escrito con el “hasheado”
          usuario.contrasena = hash;
          next();
      });
  });
});

module.exports = mongoose.model("Usuario", Usuario);
