const { Router } = require('express');
const collection = require('../connection/collection');
const functionEmail = require('../lib/libEmail');

const router = Router();  


// Registro Individual.
const newObjCandidate = {
  idUser: '',
  dateValid: '',
  test: '',
  firstName: '12345678',
  secondName: 'candidato1@gmail.com',
  firstFullName: '',
  secondFullName: '',
  tDocuments: '',
  nroDocuments: '',
  cCost: '',
  email: '',
  startSesion: { estado: true }
};

module.exports = router;