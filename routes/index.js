const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const collection = require('../connection/collection');
const config = require('../config');
const { validateEmail } = require('../utils/utils');

/* const {
  getUsers,
} = require('../controller/users'); */

const router = Router();

// router.get('/', getUsers);
router.get('/', (req, res) => res.json({ name: 'api-verificativa', version: '1.0.0' }));

// auth - login.
router.post('/auth', (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password) {
    res.status(400).send({ message: 'Ingresar Email y Password' });
  }
  return collection('users')
    .then((collectionUsers) => collectionUsers.findOne({ email })
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

// users - createUser.
router.post('/users', (req, res, next) => {
  const { email, roles = { admin: false } } = req.body;
  let { password } = req.body;

  if (!email && !password) {
    return res.status(400).send({ message: 'Ingresar Email y Password' });
  }
  if (!(validateEmail(email))) {
    return res.status(400).send({ message: 'Formato Email invalido' });
  }
  if (password.length < 4) {
    return res.status(400).send({ message: 'Password tiene que ser mayor 3 caracteres' });
  }
  password = bcrypt.hashSync(password, 10);

  return collection('users')
    .then((collectionUsers) => collectionUsers.findOne({ email })
      .then((user) => {
        if (!user) {
          return collection('users')
            .then((collectionUsers) => collectionUsers.createIndex({ email: 1 }, { unique: true }))
            .then(() => collection('users'))
            .then((collectionUsers) => collectionUsers.insertOne({ email, password, roles }))
            .then((newUser) => {
              res.send({
                _id: newUser.ops[0]._id,
                email: newUser.ops[0].email,
              });
            });
        }
        res.status(400).send({ message: 'Correo ya registrado' });
      }));
});

// Profile
router.get('/profile', (req, res) => {
  res.send(req.headers.user);
});

module.exports = router;