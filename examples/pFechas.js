
// Valida vigencia de inicio de sesión de Postulante.
// Solo para postulantes. InicioSesion = { estado: "true" || "false" }
// 1. Capturar fecha de vigencia al momento de enviar los test.
//    | Fecha Registro - Fecha hoy = nro dias --> convertir --> nro de horas vigentes. Ejm: 48h
// 2. Comparar fecha vigente con la fecha de inicio de sesión.
//    | Fecha hoy - Fecha Registro = nro días --> convertir --> nro de horas inicio sesión. Ejm: 24h
// 3. Si es menor ? True (Puede realizar examen) : False (Desactivar cuenta).
//    | horas inicio sesión > horas vigentes ? "True" Desactivar cuenta : "False" Continuar

// const vigenciaPostulante = (fechaPostulacion) => {};

// EJERCICIOS CON FECHAS - DATE() - JAVASCRIPT.

/**
 * :::SUMAR FECHAS EN JS:::
 * Ejercicio 01: Calcular el tiempo a futuro. (Que fecha sera dentro de una semana a partir de hoy).
 */

// 1. Calculamos cuantos milisegundos tiene un dia
const hoy = new Date();
/**
 * 2. Calculamos cuantos milisegundos tiene una semana.
 * donde: 1000 --> milisegundos
 * donde: 60 --> segundos
 * donde: 60 --> minutos
 * donde: 24 --> horas
 * donde: 7 --> días
 */
const semanaEnMilisegundos = 1000 * 60 * 60 * 24 * 7;

/**
 * 3. Hacemos una suma los milisegundos de semanaEnMilisegundos y hoy.getTime().
 * y le pasamos la función getTime() que devuelve milisegundos de esa fecha.
 */

const suma = hoy.getTime() + semanaEnMilisegundos;

// 4. Instanciamos el objeto Date() y le pasamos la suma en milisegundos.
const fechaDentroDeUnaSemana = new Date(suma);

// 5. Imprimimos.
console.log(fechaDentroDeUnaSemana);

/**
 * :::RESTAR FECHAS EN JS:::
 * Ejercicio 02: Veamos cual es la fecha desde hace 16 días.
 */

// 1. Obtengamos la fecha de hoy.
const hoy1 = new Date();

// 2. Calculamos 16 dias en milisegundos.
const dieciseisDias = 1000 * 60 * 60 * 24 * 16;

// 3. Hacemos la resta e instanciamos la fecha de hace 16 dias.
const resta = hoy1.getTime() - dieciseisDias;
const FechaDeHaceDieciseisDias = new Date(resta);

console.log(FechaDeHaceDieciseisDias);

/**
 * CALCULAR TIEMPO TRANSCURRIDO ENTRE DOS FECHAS.
 */

// Calculamos las dos fechas.
const hoy2 = new Date();
// Calculamos la mañana.
const manana = new Date(hoy2.getTime() + 1000 * 60 * 60 * 24 * 1.5);

// Tiempo transcurrido.
const diferencia = manana.getTime() - hoy2.getTime();

const horasTranscurridas = diferencia / 1000 / 60 / 60;

console.log('Horas transcurridas: ', horasTranscurridas);

// Ejercicio para Verificativa.
// Calcular tiempo vigente.
// Opción 1: 48h
// Opción 2: 36h
// Opción 3: otra Fecha.

// Horas vigente, ingresado por fecha
const fActual = new Date();
fActual.setTime(fActual.getTime() - fActual.getTimezoneOffset() * 60 * 1000);

const fFin = new Date('2020-04-20');

const rest = fFin.getTime() - fActual.getTime();

const horasVigente = Math.ceil(rest / 1000 / 60 / 60);

console.log('Fecha Actual: ', fActual);
console.log('Fecha Fin: ', fFin);
console.log('Horas vigente, ingresado por fecha: ', horasVigente);

// Horas vigente, ingresado por hora (Forma estática). - 36h
const fActual1 = new Date();
fActual1.setTime(fActual1.getTime() - fActual1.getTimezoneOffset() * 60 * 1000);

const fFin1 = new Date(fActual1.getTime() + 1000 * 60 * 60 * 24 * 1.5);

const rest1 = fFin1.getTime() - fActual1.getTime();

const horasVigente1 = Math.ceil(rest1 / 1000 / 60 / 60);

console.log('Horas vigente, ingresado en nro horas: 36h ', horasVigente1);

// Horas vigente, ingresado por hora (Forma estática). - 48h
const fActual2 = new Date();
fActual2.setTime(fActual2.getTime() - fActual2.getTimezoneOffset() * 1000 * 60);

const fFin2 = new Date(fActual2.getTime() + 1000 * 60 * 60 * 24 * 2); // 48h

const rest2 = fFin2.getTime() - fActual2.getTime();

const horasVigente2 = Math.ceil(rest2 / 1000 / 60 / 60);
console.log('Horas vigente, ingresado en nro horas: 48h ', horasVigente2);

// ** Convertirlas en Fecha, respecto a la hora calculada **
const suma3 = fActual2.getTime() + rest2;
const nuevaFecha = new Date(suma3);
console.log('<-----> Convertir de horas a fecha <----->', nuevaFecha);

// Simulación.
const validaLoginPostulante = (fechaLogin, fechaVigencia) => {
  if (fechaVigencia >= fechaLogin) {
    console.log('Bienvenido');
  } else {
    console.log('Caducado');
  }
};

validaLoginPostulante('2020-04-25', '2020-04-24');

// Hora que le queda


// Borrar Postulante despues de un mes.


// Envio de correo Postulantes.
