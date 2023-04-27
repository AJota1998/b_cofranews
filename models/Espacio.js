const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Colectivo = require("../models/Colectivo");

var EspacioSchema = new Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    colectivos: [{ type: Schema.ObjectId, ref: "Colectivo" }]
  });
  
module.exports = mongoose.model("Espacio", EspacioSchema);


