const { Router } = require('express');
const router = Router();

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const Espacio = require('../models/Espacio');



router.get('/', (req, res) => res.send("hola mundo"));

router.post('/crear-espacio', async (req, res) => {
  const { nombre, descripcion, colectivos } = req.body;

  // Verificar si se envió un espacio con campos faltantes
  if (!nombre && !descripcion) {
    return res.status(400).send("Faltan campos obligatorios");
  }

  const newEspacio = new Espacio({ nombre, descripcion, colectivos });
  console.log(newEspacio);

  try {
    await newEspacio.save();
    res.status(200).send("Espacio creado correctamente");
  } catch (error) {
    res.status(500).send("Error al crear el espacio");
  }
});


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


router.put('/pertenecer-espacio', async (req, res) => {

    const id_colectivo = req.body.propiedad;
    const id_espacio = req.body.propiedad2;

    try {
    
        if(await verificarYAgregarColectivo(id_espacio, id_colectivo)) {
            res.status(200).json({ message: 'Ahora perteneces a este espacio' });
        } else {
            res.status(500).json({ error: 'Error al agregar el colectivo al espacio.' });
        }
        
      } catch (error) {
        console.log(error)
      }
}) 

async function verificarYAgregarColectivo(idEspacio, idColectivo) {
    try {
      // Busca el espacio por su ID
      const espacio = await Espacio.findById(idEspacio);
  
      if (espacio) {
        // Verifica si el ID de colectivo ya existe en el array de IDs de colectivos del espacio
        if (!espacio.colectivos.includes(idColectivo)) {
          // Agrega el ID de colectivo al array de IDs de colectivos del espacio
          espacio.colectivos.push(idColectivo);
  
          // Guarda los cambios en la base de datos
          await espacio.save();
  
          console.log('El ID de colectivo ha sido agregado al espacio.');
          return true;
        } else {
          console.log('El ID de colectivo ya existe en el espacio.');
          return false;
        }
      } else {
        console.log('No se encontró el espacio con el ID proporcionado.');
        return false;
      }
    } catch (error) {
      console.error('Error al verificar y agregar el ID de colectivo:', error);
    } 
}

router.put('/salir-espacio', async (req, res) => {

    const id_colectivo = req.body.propiedad;
    const id_espacio = req.body.propiedad2;

    try {
    
        if(await verificarYEliminarColectivo(id_espacio, id_colectivo)) {
            res.status(200).json({ message: 'Colectivo retirado correctamente del espacio.' });
        } else {
            res.status(500).json({ error: 'Error al eliminar el colectivo del espacio.' });
        }
        
      } catch (error) {
        console.log(error)
      }
}) 

async function verificarYEliminarColectivo(idEspacio, idColectivo) {
  try {
    const espacio = await Espacio.findById(idEspacio); // Busca el documento por su ID

    if (espacio) {
      // Verifica si el ID de colectivo existe en el campo de array del espacio
      const index = espacio.colectivos.indexOf(idColectivo);

      if (index !== -1) {
        // Elimina el ID de colectivo del campo de array del espacio
        espacio.colectivos.splice(index, 1);

        // Guarda los cambios en el documento
        await espacio.save();

        console.log('El ID de colectivo ha sido eliminado del espacio.');
        return true;
      } else {
        console.log('El ID de colectivo no existe en el espacio.');
        return false;
      }
    } else {
      console.log('No se encontró el espacio con el ID proporcionado.');
      return false;
    }
  } catch (error) {
    console.error('Error al verificar y eliminar el ID de colectivo:', error);
    return false;
  }
}

router.post('/verificar', async (req, res) => {
    try {
      const id_colectivo = req.body.id_colectivo;
  
      const espacios = await Espacio.find({ colectivos: id_colectivo });
      const incluido = espacios.length > 0;
      console.log(espacios)
  
      res.json(incluido);
    } catch (error) {
      console.error('Error al verificar el ID del colectivo:', error);
      res.status(500).json({ error: 'Error al verificar el ID del colectivo' });
    }
  });

  router.delete('/eliminar-espacio/:id', async (req, res) => {
    const espacioId = req.params.id;
    try {
      const EspacioEliminado = await Espacio.findByIdAndDelete(espacioId);
      if (EspacioEliminado) {
        console.log('Espacio eliminado correctamente:', EspacioEliminado);
        res.status(200).send('Espacio eliminado correctamente');
      } else {
        res.status(404).send('No se encontró el espacio');
      }
    } catch (error) {
      console.error('Error al eliminar el espacio:', error);
      res.status(500).send('Error al eliminar el espacio');
    }
  });

  router.get('/espacio_del_colectivo/:colectivoId', async (req, res) => {
    const colectivoId = req.params.colectivoId;
    try {
      const espacios = await Espacio.find({ colectivos: colectivoId });
      if (espacios.length > 0) {
        res.json(espacios);
      } else {
        res.status(404).send('Este colectivo no pertenece a ningún espacio');
      }
    } catch (error) {
      console.error('Error al buscar el colectivo en los espacios:', error);
      res.status(500).send('Error al buscar el colectivo en los espacios');
    }
  });

  router.delete('/eliminar-colectivo-espacio/:colectivoId', async (req, res) => {
    const colectivoId = req.params.colectivoId;
  
    try {
      await Espacio.updateMany(
        { colectivos: colectivoId },
        { $pull: { colectivos: colectivoId } }
      );
  
      res.status(200).json({ message: 'Colectivo eliminado del espacio correctamente' });
    } catch (error) {
      console.error('Error al eliminar el colectivo del espacio:', error);
      res.status(500).json({ error: 'Error al eliminar el colectivo del espacio' });
    }
  });
  


module.exports = router;