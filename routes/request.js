const { Router } = require('express');
const collection = require('../connection/collection');
const router = Router();
// Fusion FrontEnd

router.post('/massive', (req, res) => {
    const data = req.body; // Validar nombre del arrObj con Maray.
    // TODO - Sanear el Excel (Validar la data segun formato).
    // TODO - Agregarle el propietario (Relacionar que usuario de la covocatoria).
    let db;
    // const formatoJson = functionExcel.getExcelJson();
    collection('requestMassive')
      .then((dbCollection) => db = dbCollection)
      .then(() => db.insertOne({data})) //req.body
      // .then(() => functionEmail.sendMasivoEmail(formatoJson))
      .then(() => res.send({ message:'Correos enviados!!!' }))
      .catch(err => console.log(err));
  });

  router.get('/massive', (req, res) => {
    let db;
    collection('requestMassive')
      .then((dbCollection) => db = dbCollection)
      .then(() => db.find().toArray())
      .then((result) => res.send(result))
      .catch((err) => console.log(err));
  });

module.exports = router;