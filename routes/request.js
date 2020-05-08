const { Router } = require('express');
const collection = require('../connection/collection');
const functionEmail = require('../lib/libEmail');
const router = Router();

const saveCandidates = (arrObjCandidates) => {
  // const candidatos = req.candidatos;
  // startSesion: { estado: true } --> Pedir a Front que lo incluya. Para Inicio de Sesion del Postulante
  return collection('candidates')
    .then((dbCollection) => dbCollection.insertMany(arrObjCandidates))
    .catch((err) => console.log(err));
};

const getEmail = (req) => {
  let newArr = [];
  Object.keys(req).forEach((key) => {
    newArr.push(req[key].email)
  });
  return newArr;
};

router.post('/massive', (req, res) => {
  // TODO - Sanear el Excel (Validar la data segun formato).
  // TODO - Agregarle el propietario (Relacionar que usuario de la covocatoria).
  const {
    idUser,
    dateValid,
    test,
    candidates
  } = req.body;

  if (!idUser || !dateValid || !test || !candidates){
    return res.status(400).send({ message: 'Ingresar todos los datos' });
  }

  const newRequest = {
    type: 'massive',
    idUser,
    dateValid,
    test,
    candidates: getEmail(candidates)
  };

  console.log('Soy req, body', req.body);

  let db;
  // const formatoJson = functionExcel.getExcelJson();
  return collection('convocatoria')
    .then((dbCollection) => db = dbCollection)
    .then(() => db.insertOne(newRequest))
    .then(() => functionEmail.sendMasivoEmail(newRequest.candidates))
    .then(() => saveCandidates(candidates))
    .then(() => res.send({ message: 'Correos enviados' }))
    .catch(err => console.log(err));
});

const saveCandidate = (obj) => {
  return collection('candidates')
    .then((dbCollection) => dbCollection.insertOne(obj))
    .catch((err) => console.log(err));
};

router.post('/individual', (req, res) => {
  const {
    idUser, dateValid, test,
    firstName, secondName, firstFullName,
    secondFullName, tDocuments, nroDocuments,
    cCost, email
  } = req.body;

  if (!idUser || !dateValid || !test || 
      !firstName || !secondName || !firstFullName ||
      !secondFullName || !tDocuments || !nroDocuments ||
      !cCost || !email) {
        return res.status(400).send({ message: 'Ingresar todos los datos' })
      }

  const objCandidate = {
    firstName, secondName,
    firstFullName, secondFullName,
    tDocuments, nroDocuments,
    cCost, email,
    startSesion: { estado: true }
  }

  const newRequest = {
    type: 'individual',
    idUser,
    dateValid,
    test,
    candidate: req.body.email
  };

  let db;

  return collection('convocatoria')
    .then((dbCollection) => db = dbCollection)
    .then(() => db.insertOne(newRequest))
    .then(() => functionEmail.sendEmail(email))
    .then(() => saveCandidate(objCandidate))
    .then(() => res.send({ message: 'Correo Enviado!!!' }))
    .catch((err) => console.log(err));
})

router.get('/massive', (req, res) => {
  let db;
  return collection('convocatoria')
    .then((dbCollection) => db = dbCollection)
    .then(() => db.find({type: 'massive'}).toArray())
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

router.get('/individual', (req, res) => {
  let db;
  return collection('convocatoria')
    .then((dbCollection) => db = dbCollection)
    .then(() => db.find({type: 'individual'}).toArray())
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

module.exports = router;