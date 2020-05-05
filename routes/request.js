const { Router } = require('express');
const collection = require('../connection/collection');
const router = Router();
// Fusion FrontEnd

/* router.post('/massive', (req, res) => {
    const data = req.body; // Validar nombre del arrObj con Maray.
    // TODO - Sanear el Excel (Validar la data segun formato).
    // TODO - Agregarle el propietario (Relacionar que usuario de la covocatoria).
    let db;
    // const formatoJson = functionExcel.getExcelJson();
    return collection('requestMassive')
      .then((dbCollection) => db = dbCollection)
      .then(() => db.insertOne(data)) //req.body
      // .then(() => functionEmail.sendMasivoEmail(formatoJson))
      .then(() => res.send({ message:'Correos enviados!!!' }))
      .catch(err => console.log(err));
  }); */

  router.post('/massive', (req, res) => {
    // TODO - Sanear el Excel (Validar la data segun formato).
    // TODO - Agregarle el propietario (Relacionar que usuario de la covocatoria).

    const {
      idUser,
      fechaVigencia,
      test,
      candidatos
    } = req.body;

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
      // .then(() => functionEmail.sendMasivoEmail(formatoJson))
      .then((result) => {
        res.send({
          _id: result.ops[0]._id,
          idUser: result.ops[0].idUser,
          fechaVigencia: result.ops[0].fechaVigencia,
          test: result.ops[0].test,
          candidatos: result.ops[0].candidatos
        })
      }).catch(err => console.log(err));
  });

  router.get('/massive', (req, res) => {
    let db;
    return collection('requestMassive')
      .then((dbCollection) => db = dbCollection)
      .then(() => db.find().toArray())
      .then((result) => res.send(result))
      .catch((err) => console.log(err));
  });

module.exports = router;