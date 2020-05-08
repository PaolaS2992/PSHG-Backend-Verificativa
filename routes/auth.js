const { Router } = require('express');
const collection = require('../connection/collection');
const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = Router();

// Auth - login.
router.post('/auth', (req, res, next) => {
    const { email, password } = req.body;
    if (!email && !password) {
      res.status(400).send({ message: 'Ingresar Email y Password' });
    }
    let db;
    return collection('users')
      .then((collectionUsers) => db = collectionUsers)
      .then(() => db.findOne({ email })
        .then((user) => {
          if (!user) {
            return res.status(400).send({ message: 'No estas registrado' });
          }
          // Compara password.
          if (bcrypt.compareSync(password, user.password)) {
            const payload = {
              uid: user._id,
              iss: 'api-verificativa',
              expiresIn: 60 * 60 * 24,
            };
            // Generar Token.
            const token = jwt.sign(payload, config.secret);
            res.send({ token });
          } else {
            return res.status(400).send({ message: 'Contraseña invalida' });
          }
        }));
});

// Auth - Login Postulante. 
router.post('/authPostulante', (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    res.status(400).send({message: 'Ingresar Email y Password'})
  }
  let db;
  return collection('candidates')
    .then((dbCollection) => db = dbCollection)
    .then(() => db.findOne({ email })
      .then((candidate) => {
        if (!candidate) {
          return res.status(400).send({ message: 'No estas registrado' })
        }
        // Compara pasword.
        if (bcrypt.compareSync(password, candidate.password)) {
          const payload = {
            uid: candidate._id,
            iss: 'api-verificativa',
            expiresIn: 60 * 60 * 24,
          };
          // Generar Token.
          const token = jwt.sign(payload, config.secret);
          res.send({ token });
        } else {
          return res.status(400).send({ message: 'Contraseña invalida' });
        }
      })
    )
});

module.exports = router;