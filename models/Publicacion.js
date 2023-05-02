const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Colectivo = require("../models/Colectivo");

var Publicacion = new Schema({
    idColectivo: { type: Schema.ObjectId, ref: "Colectivo" },
    tipo: { type: String, enum: ['Noticia', 'Mensaje', 'Foto', 'Video'], required: true },
    titulo: { type: String }, 
    contenido: { type: String, required: true },
    pie: { type: String },
    imagen: { type: String },
    fechaPublicacion: { type: Date, default: Date.now },
  });
  
module.exports = mongoose.model("Publicacion", Publicacion);