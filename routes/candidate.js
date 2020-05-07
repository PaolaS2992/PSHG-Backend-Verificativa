const { Router } = require('express');
const collection = require('../connection/collection');
const functionEmail = require('../lib/libEmail');

const router = Router();

  


// Registro Individual.
const newObjCandidate = {
  idUser: '',
  fechaVigencia: '',
  test: '',
  primerNombre: '12345678',
  segundoNombre: 'candidato1@gmail.com',
  apellidoPaterno: '',
  apellidoMaterno: '',
  tDocumento: '',
  nroDocumento: '',
  cCosto: '',
  email: '',
  startSesion: { estado: true }
};

module.exports = router;