console.log('Entorno de: ', process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const config = require('./config');
const database = require('./connection/connectDB');
const authMiddleware = require('./middleware/auth');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const candidatesRouter = require('./routes/candidates');

// A. Crear el Servidor.
const app = express();

// B. Conexion a la bd.
database();

// C. Middleware - Cors - Permite acceso al API de otros dominios.
app.use(cors());

// D. Middleware - Permite ver data enviada del navegador por CLI.
app.use(morgan('dev'));

// F. Middleware - Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// G. authMiddleware
app.use(authMiddleware(config.secret));

/* // registrar rutas
routes(app, (err) => {
  if (err) throw err;
  app.listen(config.port, () => {
    console.info(`App listening on port ${config.port}`);
  });
}); */

// H. Middleware - Importar rutas.
app.use(authRouter);
app.use(usersRouter);
app.use(candidatesRouter);

app.listen(config.port, () => {
  console.log(`App listen port ${config.port}`);
});
