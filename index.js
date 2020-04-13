console.log('Entorno de: ', process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

const morgan = require('morgan');
const express = require('express');
const config = require('./config');
const database = require('./connection/connectDatabase');
const routes = require('./routes/index');
const authMiddleware = require('./middleware/auth');

// A. Crear el Servidor.
const app = express();

// B. Conexion a la bd.
database();

// C. Middleware - Permite ver data enviada del navegador por CLI.
app.use(morgan('dev'));

// D. Middleware - Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// authMiddleware
app.use(authMiddleware(config.secret));

/* // registrar rutas
routes(app, (err) => {
  if (err) throw err;
  app.listen(config.port, () => {
    console.info(`App listening on port ${config.port}`);
  });
}); */

// E. Middleware - Importar rutas.
app.use(routes);

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`App listen port ${app.get('port')}`);
});
