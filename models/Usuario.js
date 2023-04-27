const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Espacio = require("../models/Espacio");

var UsuarioSchema = new Schema({
  nombreCompleto: { type: String, required: true },
  nombreUsuario: { type: String, required: true, unique: true, minlength: 4, maxlength: 12 },
  correoElectronico: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  imagenPerfil: { type: String },
  rol: { type: String, enum: ['Administrador', 'General'], required: true },
  espacios: [{ type: Schema.ObjectId, ref: "Espacio" }]
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
