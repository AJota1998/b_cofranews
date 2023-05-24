const { Router } = require('express');
const router = Router();

const Colectivo = require('../models/Colectivo');


const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

router.get('/', (req, res) => res.send("hola mundo"));

router.post('/registro-colectivo', async (req, res) => {

    const { nombreColectivo, correo, contrasena, tipo, provincia, localidad, anoFundacion, descripcion} = req.body;
    
    const newColectivo = new Colectivo({nombreColectivo, correo, contrasena, tipo, provincia, localidad, anoFundacion, descripcion});
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

    return res.status(200).json({token, correo: colectivo.correo, id: colectivo._id});
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

router.get('/perfil-colectivo', (req, res) => {

    const valor = req.query.propiedad;

    Colectivo.find({correo: valor})
    .then(function (err, colectivo) {
        if (err) {
            return res.send(err);
        } else {
            res.status(200).json(colectivo);
        }
    })
})

router.get('/info-colectivo', (req, res) => {

    const valor = req.query.propiedad;

    Colectivo.find({correo: valor}, {nombreColectivo: 1, anoFundacion: 1, descripcion:1})
    .then(function (err, colectivo){
        if (err) {
            return res.send(err);
        } else {
            res.status(200).json(colectivo);
        }
    })
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