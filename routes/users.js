const { Router } = require('express');
const collection = require('../connection/collection');
const bcrypt = require('bcrypt');
const functionUtils = require('../utils/utils');

const router = Router();

// users - createUser.
router.post('/users', (req, res, next) => {
    const { email, roles = { admin: false } } = req.body;
    let { password } = req.body;
  
    if (!email && !password) {
      return res.status(400).send({ message: 'Ingresar Email y Password' });
    }
    if (!(functionUtils.validateEmail(email))) {
      return res.status(400).send({ message: 'Formato Email invalido' });
    }
    if (password.length < 4) {
      return res.status(400).send({ message: 'Password tiene que ser mayor 3 caracteres' });
    }
    password = bcrypt.hashSync(password, 10);
  
    let db;
    return collection('users')
      .then((collectionUsers) => db = collectionUsers)
      .then(() => db.findOne({ email })
        .then((user) => {
          if (!user){
            return collection('users')
              .then((collectionUsers) => db = collectionUsers)
              .then(() => db.createIndex({email:1}, {unique:true}))
              .then(() => db.insertOne({email, password, roles}))
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

module.exports = router;