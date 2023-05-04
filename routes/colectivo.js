const { Router } = require('express');
const router = Router();

const Colectivo = require('../models/Colectivo');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

router.get('/', (req, res) => res.send("hola mundo"));

router.post('/registro-colectivo', async (req, res) => {
    const { nombreColectivo, correo, contrasena, tipo, provincia, localidad } = req.body;
    const newColectivo = new Colectivo({nombreColectivo, correo, contrasena, tipo, provincia, localidad});
    console.log(newColectivo);
    await newColectivo.save();

    const token = jwt.sign({_id: newColectivo._id}, 'secretKey')
    
   res.status(200).json({token});
})

router.post('/login-colectivo', async (req, res) => {
    const { correo, contrasena } = req.body;
    const colectivo = await Colectivo.findOne({correo});
    
    if (!colectivo) return res.status(401).send('El correo no existe');
    let compare = bcrypt.compareSync(contrasena, colectivo.contrasena);
    if(!compare) return res.status(401).send('la contraseña no coincide');
    
	const token = jwt.sign({_id: colectivo._id}, 'secretKey');

    return res.status(200).json({token});
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