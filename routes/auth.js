const { Router } = require('express');
const collection = require('../connection/collection');
const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = Router();

// auth - login.
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

// auth - login - postulante.
router.post('/authPostulante', (req, res) => {});

module.exports = router;