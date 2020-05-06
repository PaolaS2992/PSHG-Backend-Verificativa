const { Router } = require('express');
const collection = require('../connection/collection');
const functionEmail = require('../lib/libEmail');
const router = Router();

router.post('/massive', (req, res) => {
  // TODO - Sanear el Excel (Validar la data segun formato).
  // TODO - Agregarle el propietario (Relacionar que usuario de la covocatoria).
  const {
    idUser,
    fechaVigencia,
    test,
    candidatos
  } = req.body;

  if (!idUser || !fechaVigencia || !test || !candidatos){
    return res.status(400).send({ message: 'Ingresar todos los datos' });
  }

  const newRequest = {
    idUser: req.body.idUser,
    fechaVigencia: req.body.fechaVigencia,
    test: req.body.test,
    candidatos: req.body.candidatos
  };

  console.log('Soy req, body', req.body);

  let db;
  // const formatoJson = functionExcel.getExcelJson();
  return collection('requestMassive')
    .then((dbCollection) => db = dbCollection)
    .then(() => db.insertOne(newRequest))
    .then(() => functionEmail.sendMasivoEmail(newRequest))
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