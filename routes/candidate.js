const { Router } = require('express');
const collection = require('../connection/collection');
const functionExcel = require('../lib/libExcel');
const functionEmail = require('../lib/libEmail');

const router = Router();

// Envio de correos Masivos
router.post('/masivo-ant', (req, res) => {
  // const { ..., inicioSesion: {esatado: true}} = req;
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

// Registro Individual.
const newObjCandidate = {
  nombreCompleto: '',
  fechaNacimiento: '',
  tipoDocumento: '',
  nroDocumento: '12345678',
  correoElectronico: 'candidato1@gmail.com',
  nroCelular: '',
  centroCosto: '',
  cargoPostula: '',
  fechaLimite: '',
  startSesion: { estado: true }
};

module.exports = router;