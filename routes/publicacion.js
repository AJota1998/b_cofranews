const { Router, response } = require('express');
const router = Router();

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const Publicacion = require('../models/Publicacion');

router.get('/', (req, res) => res.send("hola mundo"));

router.post('/crear-publicacion', async (req, res) => {
    const {idColectivo, idEspacio, tipo, titulo, contenido, pie, } = req.body;
    const newPublicacion = new Publicacion({idColectivo, idEspacio, tipo, titulo, contenido, pie});
    console.log(newPublicacion);
    await newPublicacion.save();
    res.status(200).send("Publicación creada correctamente");
})

router.get('/publicaciones', async function (req, res) {
    const valor = req.query.propiedad

   Publicacion.find({idColectivo: valor})
   .then(function (err, publicacion) {
        if (err) {
            return res.send(err)
        } else {
            res.status(200).json(publicacion)
        }
   })
})

router.get('/all-publicaciones', async (req, res) => {
   
    Publicacion.find()
   .then(function (err, publicacion) {
        if (err) {
            return res.send(err)
        } else {
            res.status(200).json(publicacion)
        }
   })  
})

module.exports = router;