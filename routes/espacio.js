const { Router } = require('express');
const router = Router();

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const Espacio = require('../models/Espacio');



router.get('/', (req, res) => res.send("hola mundo"));

router.post('/crear-espacio', async (req, res) => {
    const {nombre, descripcion, colectivos} = req.body;
    const newEspacio = new Espacio({nombre, descripcion, colectivos});
    console.log(newEspacio);
    await newEspacio.save();
    res.status(200).send("Espacio creado correctamente");
})

router.get('/explorar', async (req, res) => {

    Espacio.find().sort("-nombre")
    .then(function (err, espacio) {
        if (err) {
            return res.send(err);
        } else {
            res.status(200).json(espacio)
        } 
    })
})

router.get('/espacios-colectivo', async function (req, res) {

    const valor = req.query.propiedad 

    Espacio.find({'colectivos': {$in: [valor]}})
    .then (Espacio => {
        if (Espacio) {
            res.status(200).json(Espacio)
        } else {
            res.status(200).json({resultado: "No pertenece a ningun espacio"})
        }
    })
    .catch(err => {
        res.status(500).json({error: "Error en la consulta"})
    })
})



module.exports = router;