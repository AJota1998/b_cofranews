const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;


var Colectivo = new Schema({
  nombreColectivo: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  tipo: { type: String, enum: ['Asociación cofrade', 'Hermandad de vísperas', 'Hermandad de penitencia', 'Hermandad de gloria', 
  'Agrupación musical (AM)', 'Cornetas y tambores (CCTT)', 'Banda de música (BM)', 'Órgano oficial', 'Órgano católico'], required: true },
  provincia: { type: String },
  localidad: { type: String },
  imagenPerfil: { type: String },
  informacion: {
    nombre: {type: String},
    anoFundacion: {type: Number},
    descripcion: {type: String}
  }
});

Colectivo.pre('save',function(next){
  var colectivo = this;
  // solo aplica una función hash al password si ha sido modificado (o es nuevo)
  if (!colectivo.isModified('contrasena')) return next();
  // genera la salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);
      // aplica una función hash al password usando la nueva salt
      bcrypt.hash(colectivo.contrasena, salt, function(err, hash) {
          if (err) return next(err);
          // sobrescribe el password escrito con el “hasheado”
          colectivo.contrasena = hash;
          next();
      });
  });
});

module.exports = mongoose.model("Colectivo", Colectivo);
