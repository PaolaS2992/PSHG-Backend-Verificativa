// Calcula por examen (Documento por documento).
const getPuntaje = (arrObjPuntaje) => {
  let suma = 0;
  arrObjPuntaje.forEach((ele) => {
    suma += parseInt(ele.puntaje, 10);
  });
  return suma;
};

const examen0 = [{ respuesta: 'abc', puntaje: 1 }, { respuesta: 'abc', puntaje: 2 }, { respuesta: 'abc', puntaje: 3 }];

console.log('Un solo examen: ', getPuntaje(examen0));

// Calcula total de todos examenes (De la coleccion).
const getPuntaje2 = (arrObjPuntaje) => {
  let suma = 0;
  arrObjPuntaje.forEach((ele) => {
    console.log('nivel 1', ele);
    ele.forEach((elemento) => {
      console.log('nivel 2', elemento.puntaje);
      suma += parseInt(elemento.puntaje, 10);
    });
  });
  return suma;
};
const examen1 = [{ respuesta: 'abc', puntaje: 5 }, { respuesta: 'abc', puntaje: 10 }, { respuesta: 'abc', puntaje: 15 }];
const examen2 = [{ respuesta: 'abc', puntaje: 1 }, { respuesta: 'abc', puntaje: 2 }, { respuesta: 'abc', puntaje: 3 }];
const resultado2 = [examen1, examen2];

console.log('varios examenes: ', getPuntaje2(resultado2));
