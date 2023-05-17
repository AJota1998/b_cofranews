const { Router } = require('express');
const router = Router();

const User = require('../models/Usuario');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const uploadFile = require('../middleware/multer');

router.get('/', (req, res) => res.send("hola mundo"));

router.post('/registroUser', async (req, res) => {
    const { nombre, nombreUsuario, correoElectronico, contrasena, rol } = req.body;
    const newUser = new User({nombre, nombreUsuario, correoElectronico, contrasena, rol})
    console.log(newUser);
    await newUser.save();

    const token = jwt.sign({_id: newUser._id}, 'secretKey')
    
   res.status(200).json({token});
})

router.post('/login', async (req, res) => {
    const { correoElectronico, contrasena } = req.body;
    const user = await User.findOne({correoElectronico});
    
    if (!user) return res.status(401).send('El correo no existe');
    let compare = bcrypt.compareSync(contrasena, user.contrasena);
    if(!compare) return res.status(401).send('la contraseña no coincide');
    
	const token = jwt.sign({_id: user._id}, 'secretKey');

    return res.status(200).json({token, rol: user.rol});
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

router.get('/private-task', verifyToken, (req, res) => {
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