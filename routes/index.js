const { Router } = require('express');
const collection = require('../connection/collection');

/* const {
  getUsers,
} = require('../controller/users'); */

const router = Router();

// Al iniciar API.
router.get('/', (req, res) => res.json({ name: 'api-verificativa', version: '1.0.0' }));

// profile
router.get('/profile', (req, res) => {
  res.send(req.headers.user);
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
