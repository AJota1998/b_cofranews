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

module.exports = router;