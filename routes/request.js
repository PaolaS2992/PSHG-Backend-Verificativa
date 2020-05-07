const { Router } = require('express');
const collection = require('../connection/collection');
const functionEmail = require('../lib/libEmail');
const router = Router();

const saveCandidate = (req) => {
  // const candidatos = req.candidatos;
  // startSesion: { estado: true } --> Pedir a Front que lo incluya.
  return collection('candidates')
    .then((dbCollection) => dbCollection.insertMany(req))
    .catch((err) => console.log(err));
};

const getEmail = (req) => {
  //const candidatos = req.candidatos;
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
    idUser: req.body.idUser,
    dateValid: req.body.dateValid,
    test: req.body.test,
    candidates: getEmail(candidates)
  };

  console.log('Soy req, body', req.body);

  let db;
  // const formatoJson = functionExcel.getExcelJson();
  return collection('requestMassive')
    .then((dbCollection) => db = dbCollection)
    .then(() => db.insertOne(newRequest))
    .then(() => functionEmail.sendMasivoEmail(newRequest))
    .then(() => saveCandidate(candidates))
    .then(() => res.send({ message: 'Correos enviados' }))
    .catch(err => console.log(err));
});

/* res.send({
        _id: result.ops[0]._id,
        idUser: result.ops[0].idUser,
        fechaVigencia: result.ops[0].fechaVigencia,
        test: result.ops[0].test,
        candidatos: result.ops[0].candidatos
      }) */

router.get('/massive', (req, res) => {
  let db;
  return collection('requestMassive')
    .then((dbCollection) => db = dbCollection)
    .then(() => db.find().toArray())
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

module.exports = router;