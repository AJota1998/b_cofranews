const { Router } = require('express');
const router = Router();
var SALT_WORK_FACTOR = 10;

const User = require('../models/Usuario');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const uploadFile = require('../middleware/multer');

router.get('/', (req, res) => res.send("hola mundo"));

router.post('/registroUser', async (req, res) => {
  const { nombre, nombreUsuario, correoElectronico, contrasena, rol, espacios } = req.body;

  // Verificar si se envió un usuario vacío
  if (!nombre && !nombreUsuario && !correoElectronico && !contrasena && !rol) {
    return res.status(400).send("Faltan campos obligatorios");
  }

  const newUser = new User({ nombre, nombreUsuario, correoElectronico, contrasena, rol, espacios });
  console.log(newUser);

  try {
    await newUser.save();

    const token = jwt.sign({ _id: newUser._id }, 'secretKey');
    res.status(200).json({ token, correoElectronico: newUser.correoElectronico, rol: newUser.rol });
  } catch (error) {
    res.status(500).send("Error al registrar el usuario");
  }
});


router.post('/login', async (req, res) => {
    const { correoElectronico, contrasena } = req.body;
    const user = await User.findOne({correoElectronico});
    
    if (!user) return res.status(401).send('Correo o contraseña incorreta');
    let compare = bcrypt.compareSync(contrasena, user.contrasena);
    console.log(contrasena)
    console.log(user.contrasena)
    if(!compare) return res.status(401).send('Correo o contraseña incorreta');
    
	const token = jwt.sign({_id: user._id}, 'secretKey');

    return res.status(200).json({token, rol: user.rol, correoElectronico: user.correoElectronico});
});

router.get('/task', (req, res) => {
    res.json([
        {
            _id: 1,
            nombre: "tarea1"
        }, 
        {
            _id: 2,
            nombre: "tarea2"
        }, 
        {
            _id: 3,
            nombre: "tarea3"
        }
    ])
})


// Obtener los espacios que sigue el usuario
router.get('/private-task', (req, res) => {
    
    const valor = req.query.propiedad;

    User.find({correoElectronico: valor}, {espacios: 1, nombre: 1, _id: 0}).sort("-nombre").populate("espacios", "nombre")
    .then(function (err, user) {
        if (err) {
            return res.send(err);
        } else {
            res.status(200).json(user)
        } 
    })
})

router.get('/perfil-usuario', (req, res) => {
    
    const valor = req.query.propiedad;

    User.find({correoElectronico: valor}, {espacios: 0}).
    then(function (err, user) {
        if (err) {
            return res.send(err);
        } else {
            res.status(200).json(user)
        }
    })
})

router.get('/all-users', (req, res) => {
  User.find({ rol: { $ne: 'Administrador' } })
    .then(function (users) {
      res.status(200).json(users);
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});


router.put('/seguir-espacio', async (req, res) => {
    const espacio = req.body.propiedad;
    const correo = req.body.propiedad2;
  
    try {
      const user = await User.findOne({ correoElectronico: correo });
  
      if (user) {
        console.log(user);
  
        if (user.espacios.includes(espacio)) {
          console.log("El espacio ya está añadido para este usuario");
          res.status(400).json({ message: "Ya sigues este espacio" });
        } else {
          await User.updateOne({ correoElectronico: correo }, { $push: { espacios: espacio } });
          console.log("Espacio añadido correctamente");
          res.status(200).json({ message: "Espacio añadido correctamente" });
        }
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  router.put('/abandonar-espacio', async (req, res) => {
    const espacioId = req.body.propiedad;
    const correo = req.body.propiedad2;
    console.log(espacioId)
  
    try {
      const user = await User.findOne({ correoElectronico: correo });
  
      if (user) {
        console.log(user);
  
        if (user.espacios.includes(espacioId)) {
            await User.updateOne({ correoElectronico: correo }, { $pull: { espacios: espacioId } });
            console.log("Espacio dejado de seguir");
            res.status(200).json({ message: "Has dejado de seguir este espacio" });
          } else {
            console.log("El usuario no sigue este espacio");
            res.status(400).json({ message: "El usuario no sigue este espacio" });
          }
        } else {
          res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
  
  
  router.put('/actualizar-usuario', async (req, res) => {
    const usuario = req.body;
    console.log(usuario);
  
    try {
        //const hashedPassword = await bcrypt.hash(usuario.contrasena, 10);
        //usuario.contrasena = hashedPassword;
        const user = await User.findOneAndUpdate({ _id: usuario._id }, usuario, { new: true });
  
      if (user) {
        console.log(user);
        res.status(200).json({ message: 'Usuario actualizado correctamente' });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });
  
  
  router.delete('/eliminar-usuario/:id', async (req, res) => {
    const usuarioId = req.params.id;
    try {
      const usuarioEliminado = await User.findByIdAndDelete(usuarioId);
      if (usuarioEliminado) {
        console.log('Usuario eliminado correctamente:', usuarioEliminado);
        res.status(200).send('Usuario eliminado correctamente');
      } else {
        res.status(404).send('No se encontró el usuario');
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      res.status(500).send('Error al eliminar el usuario');
    }
  });


function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send("No está autorizado");
    }

    const token = req.headers.authorization.split(' ')[1];
    if (token === null) {
        return res.status(401).send("No está autorizado");
    }

    const payload = jwt.verify(token, "secretKey");
    req.userId = payload._id;
    next();
}

module.exports = router;