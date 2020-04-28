const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const collection = require('../connection/collection');
const config = require('../config');
const functionUtils = require('../utils/utils');
const functionEmail = require('../lib/libEmail');
const functionExcel = require('../lib/libExcel');

/* const {
  getUsers,
} = require('../controller/users'); */

const router = Router();

// Al iniciar API.
router.get('/', (req, res) => res.json({ name: 'api-verificativa', version: '1.0.0' }));

// auth - login.
router.post('/auth', (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password) {
    res.status(400).send({ message: 'Ingresar Email y Password' });
  }
  let db;
  return collection('users')
    .then((collectionUsers) => db = collectionUsers)
    .then(() => db.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.status(400).send({ message: 'No estas registrado' });
        }
        // Compara password.
        if (bcrypt.compareSync(password, user.password)) {
          const payload = {
            uid: user._id,
            iss: 'api-verificativa',
            expiresIn: 60 * 60 * 24,
          };
          // Generar Token.
          const token = jwt.sign(payload, config.secret);
          res.send({ token });
        } else {
          return res.status(400).send({ message: 'Contraseña invalida' });
        }
      }));
});

// auth - login - postulante.
router.post('/auth', (req, res) => {});

// users - createUser.
router.post('/users', (req, res, next) => {
  const { email, roles = { admin: false } } = req.body;
  let { password } = req.body;

  if (!email && !password) {
    return res.status(400).send({ message: 'Ingresar Email y Password' });
  }
  if (!(functionUtils.validateEmail(email))) {
    return res.status(400).send({ message: 'Formato Email invalido' });
  }
  if (password.length < 4) {
    return res.status(400).send({ message: 'Password tiene que ser mayor 3 caracteres' });
  }
  password = bcrypt.hashSync(password, 10);

  let db;
  return collection('users')
    .then((collectionUsers) => db = collectionUsers)
    .then(() => db.findOne({ email })
      .then((user) => {
        if (!user){
          return collection('users')
            .then((collectionUsers) => db = collectionUsers)
            .then(() => db.createIndex({email:1}, {unique:true}))
            .then(() => db.insertOne({email, password, roles}))
            .then((newUser) => {
              res.send({
                _id: newUser.ops[0]._id,
                email: newUser.ops[0].email,
              });
            });
        }
        res.status(400).send({ message: 'Correo ya registrado' });
      }));
});

// profile
router.get('/profile', (req, res) => {
  res.send(req.headers.user);
});

// Envio de correos Masivos
router.post('/masivo', (req, res) => {
  // TODO - Sanear el Excel (Validar la data segun formato).
  // TODO - Agregarle el propietario (Relacionar que usuario de la covocatoria).
  let db;
  const formatoJson = functionExcel.getExcelJson();
  collection('postulantes')
   .then((dbCollection) => db = dbCollection)
   .then(() => db.insertMany(formatoJson))
   .then(() => functionEmail.sendMasivoEmail(formatoJson))
   .then(() => res.send({ message:'Correos enviados!!!' }))
   .catch(err => console.log(err));
});

router.get('/masivo', (req, res) => {
  let db;
  collection('postulantes')
    .then((dbCollection) => db = dbCollection)
    .then(() => db.find().toArray())
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

// Hackaton Interna - Guardar respuesta de test.
router.post('/test', (req, res) => {
  const resTest = {
    emailPostulante: req.headers.user.email,
    tiempoRealizado: '15 min', // req.body.time
    nombrePrueba: 'Estres laboral', // falta
    resultados: req.body, // resultados: req.body.resultados,
  };
  
  return collection('resultados')
    .then((collectionResultados) => collectionResultados.insertOne(resTest))
    .then((newTest) => {
      res.send(newTest.ops[0]);
    });
});

// Hackathon Interna - Mostrar respuestas test de todos postulantes.
const getPuntaje = (arrObjPuntaje) => {
  let suma = 0;
  arrObjPuntaje.forEach((ele) => {
    suma += parseInt(ele.puntaje, 10);
  });
  return suma;
};

const getStatus = (puntaje) => {
  let status = '';
  // puntaje > 100 ? status = 'Apto' : status = 'No Apto';
  if (puntaje > 100) {
    status = 'Apto';
  } else {
    status = 'No apto';
  }
  return status;
};

router.get('/dashboard', (req, res) => {
  return collection('resultados')
    .then((collectionResultados) => collectionResultados.find().toArray())
    .then((docsResultado) => {
      // Calcular el puntaje por examen.
      const calificacion = docsResultado.map((doc) => {
        const objResponse = {
          email: doc.emailPostulante,
          nombrePrueba: doc.nombrePrueba,
          tiempoRealizado: doc.tiempoRealizado,
          totalPuntaje: getPuntaje(doc.resultados),
        };
        return objResponse;
      });
      res.send(calificacion);
    });
});

module.exports = router;

/*
// TOTAL DE CALIFICACIÓN.
router.get('/dashboard', (req, res) => {
  return collection('resultados')
    .then((collectionResultados) => collectionResultados.find().toArray())
    .then((docResultado) => {
      // Calcular el puntaje por examen.
      const resTest = docResultado.map((resultado) => resultado.resultados);
      let suma = 0;
      const puntajeFinal = resTest.map((resultados) => {
        console.log('soy resultados!!!', resultados);
        suma = getPuntaje(resultados);
        return suma;
      });
      res.send(puntajeFinal);
    });
}); */
