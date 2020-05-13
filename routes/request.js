const { Router } = require('express');
const { ObjectId } = require('mongodb');
const collection = require('../connection/collection');
const functionEmail = require('../lib/libEmail');

const router = Router();
const bcrypt = require('bcrypt');

const addProperty =  (arrObj) => {
  let newArrObj = [];
  arrObj.map((property) => {
    const newObj = {... property,
    startSesion: { estado: true },
    password: bcrypt.hashSync(property.nroDocuments, 10)};
    newArrObj.push(newObj);
  });
  return newArrObj;
};

const saveCandidates = (arrObjCandidates) => {
  const newArrCandidate = addProperty(arrObjCandidates);
  return collection('candidates')
    .then((dbCollection) => dbCollection.insertMany(newArrCandidate))
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
  return collection('request')
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
    startSesion: { estado: true },
    password: bcrypt.hashSync(nroDocuments, 10)
  }

  const newRequest = {
    type: 'individual',
    idUser,
    dateValid,
    test,
    candidate: req.body.email
  };

  let db;

  return collection('request')
    .then((dbCollection) => db = dbCollection)
    .then(() => db.insertOne(newRequest))
    .then(() => functionEmail.sendEmail(email))
    .then(() => saveCandidate(objCandidate))
    .then(() => res.send({ message: 'Correo Enviado!!!' }))
    .catch((err) => console.log(err));
})

router.get('/massive', (req, res) => {
  let db;
  return collection('request')
    .then((dbCollection) => db = dbCollection)
    .then(() => db.find({type: 'massive'}).toArray())
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

router.get('/individual', (req, res) => {
  let db;
  return collection('request')
    .then((dbCollection) => db = dbCollection)
    .then(() => db.find({type: 'individual'}).toArray())
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

router.put('/massive/:convocatoriaId', (req, res) => {
  const query = new ObjectId(req.params.convocatoriaId);

  if (!query) {
    return res.status(400).send({ message: 'Ingresar Id Convocatoria' });
  }

  // Solo se podra editar la Fecha de Vigencia.
  const { type, idUser, dateValid, test, candidates } = req.body;

  if (!type || !idUser || !dateValid || !test || !candidates){
    return res.status(400).send({ message: 'Faltan datos' });
  }

  let db;
  return collection('request')
    .then((dbCollection) => db = dbCollection)
    .then(() => db.findOne({ _id: query }))
    .then((result) => {
      if (!result) {
        return res.status(400).send({ message:'No existe convocatoria masiva' })
      }
      return collection('request')
        .then((dbCollection) => db = dbCollection)
        .then(() => db.updateOne({ _id: query }, {
          $set: {
            type: type || result.type,//* Solo lectura.
            idUser: idUser || result.idUser,//* Se cambia por el usuario que edito (req.header.user).
            dateValid: dateValid || result.dateValid,//* Se puede editar.
            test: test || result.test,//* Solo lectura.
            candidates: candidates || result.candidates//* Solo lectura.
          }
        }))
        .then(() => res.send({ message: 'Convocatoria masiva actualizada' }));
    }).catch((err) => console.log(err));
});

router.put('/individual/:convocatoriaId', (req, res) => {
  const query = new ObjectId(req.params.convocatoriaId);
  if (!query) {
    return res.status(400).send({ message:'Ingresar Id Convocatoria' });
  }

  const { type, idUser, dateValid, test, candidate } = req.body;
  if (!type || !idUser || !dateValid || !test || !candidate){
    return res.status(400).send({ message: 'Faltan datos' });
  }

  let db;
  return collection('request')
    .then((dbCollection) => db = dbCollection)
    .then(() => db.findOne({ _id: query }))
    .then((result) => {
      if(!result) {
        return res.status(400).send({ message: 'No existe convocatoria individual' })
      }
      return collection('request')
        .then((dbCollection) => db = dbCollection)
        .then(() => db.updateOne({ _id: query }, {
          $set: {
            type: type || result.type,//* Solo lectura.
            idUser: idUser || result.idUser,//* Se cambia por el usuario que edito (req.header.user).
            dateValid: dateValid || result.dateValid,//* Se puede editar.
            test: test || result.test,//* Solo lectura.
            candidate: candidate || result.candidate//* Solo lectura.
          }
        }))
        .then(() => res.send({ message: 'Convocatoria individual Actualizada' }))
    }).catch((err) => console.log(err) );
});

module.exports = router;