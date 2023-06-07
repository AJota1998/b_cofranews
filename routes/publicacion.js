const { Router, response } = require('express');
const router = Router();

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const Publicacion = require('../models/Publicacion');

router.get('/', (req, res) => res.send("hola mundo"));

router.post('/crear-publicacion', async (req, res) => {
    const { idColectivo, idEspacio, tipo, titulo, contenido, pie } = req.body;
  
    // Verificar si la publicación está vacía
    if (!idColectivo || !idEspacio || !tipo || !titulo || !contenido || !pie) {
      return res.status(400).send("Faltan campos obligatorios");
    }
  
    const newPublicacion = new Publicacion({ idColectivo, idEspacio, tipo, titulo, contenido, pie });
  
    console.log(newPublicacion);
  
    try {
      await newPublicacion.save();
      res.status(200).send("Publicación creada correctamente");
    } catch (error) {
      res.status(500).send("Error al crear la publicación");
    }
  });
  

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

router.get('/contenido-espacios', async (req, res) => {
    const valor = req.query.propiedad 

    Publicacion.find({idEspacio: valor})
    .then(function (err, publicacion) {
        if (err) {
            return res.send(err)
        } else {
            res.status(200).json(publicacion)
        }
    })
})

router.delete('/eliminar-publicacion/:id', async (req, res) => {
    try {
      const id = req.params.id;
  
      // Busca y elimina la publicación por su ID
      await Publicacion.findByIdAndDelete(id);
  
      res.status(200).json({ message: 'Publicación eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la publicación' });
    }
  });

module.exports = router;