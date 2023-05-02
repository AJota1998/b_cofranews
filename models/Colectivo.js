const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    type: {
      nombre: { type: String },
      anoFundacion: { type: Number },
      descripcion: { type: String }
    }
  }
});

module.exports = mongoose.model("Colectivo", Colectivo);
