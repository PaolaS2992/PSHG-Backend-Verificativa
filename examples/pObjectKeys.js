const bcrypt = require('bcrypt');

// Ejercicio 01: Array de Objetos.
const arrObj = [
    {
        _id: "5ea6e0e0b407d2140c5956e8",
        Nombre: "Sonia",
        Apellidos: "Gonzales",
        dni: "20035229",
        email: "huaripayta29.92@gmail.com",
        fecha: 43926
    },
    {
        _id: "5ea6e0e0b407d2140c5956e9",
        Nombre: "Eddie",
        Apellidos: "Huaripayta",
        dni: "1234567",
        email: "libra_pshg@hotmail.com",
        fecha: 43926
    },
];

function getArrEmail(arrObjTotal){
    let newArrEmail = [];
    Object.keys(arrObjTotal).forEach((key) => {
        newArrEmail.push(arrObjTotal[key].email);
    });  
    return newArrEmail;
} 
console.log(getArrEmail(arrObj));

// Ejercicio 02: Array de Objeto y (sub) Array de Objeto
const arrObj1 = [
    {
        idUser: 'idUserRrhh2',
        fechaVigencia: '2020-05-05',
        test: ['cod-Test1', 'cod-Test2'],
        candidatos: [
            {
                primerNombre: 'Postulante100',
                segundoNombre: 'Postulante100',
                apellidoPaterno: 'Postulante100',
                apellidoMaterno: 'Postulante100',
                tDocumento: 'dni',
                nroDocumento: '1234568',
                cCosto: 'sede02',
                email: 'huaripayta29.92@gmail.com'
            },
            {
                primerNombre: 'Postulante101',
                segundoNombre: 'Postulante101',
                apellidoPaterno: 'Postulante101',
                apellidoMaterno: 'Postulante101',
                tDocumento: 'dni',
                nroDocumento: '1234568',
                cCosto: 'sede02',
                email: 'maraymontes@gmail.com'
            },
        ]
    }
]; 

function getArrEmail1(arrObjTotal){
    let newArrEmail = [];
    Object.keys(arrObjTotal).forEach((key) => {
        //console.log(arrObjTotal[key].candidatos);
        const candidatos = arrObjTotal[key].candidatos;
        Object.keys(candidatos).forEach((key) => {
            // console.log('hola', candidatos[key].email);
            newArrEmail.push(candidatos[key].email);
        })
    });  
    return newArrEmail;
}

console.log(getArrEmail1(arrObj1));

// Ejercicio 03: Objetos.

const arrObj2 =
    {
        idUser: 'idUserRrhh2',
        fechaVigencia: '2020-05-05',
        test: ['cod-Test1', 'cod-Test2'],
        candidatos: [
            {
                primerNombre: 'Postulante100',
                segundoNombre: 'Postulante100',
                apellidoPaterno: 'Postulante100',
                apellidoMaterno: 'Postulante100',
                tDocumento: 'dni',
                nroDocumento: '1234568',
                cCosto: 'sede02',
                email: 'huaripayta29.92@gmail.com'
            },
            {
                primerNombre: 'Postulante101',
                segundoNombre: 'Postulante101',
                apellidoPaterno: 'Postulante101',
                apellidoMaterno: 'Postulante101',
                tDocumento: 'dni',
                nroDocumento: '1234568',
                cCosto: 'sede02',
                email: 'maraymontes@gmail.com'
            },
        ]
    };

function getArrEmail3(arrObjTotal){
    let soloEmail = arrObjTotal.candidatos;
    // console.log(soloEmail);
    let newArrEmail = [];
    Object.keys(soloEmail).forEach((key) => {
        newArrEmail.push(soloEmail[key].email);
    });  
    return newArrEmail;
}
console.log(getArrEmail3(arrObj2));


// Ejercicio 04: Agregar propiedades al array de Objetos.

const arrObj3 = [
    {
        _id: "5ea6e0e0b407d2140c5956e8",
        Nombre: "Sonia",
        Apellidos: "Gonzales",
        dni: "20035229",
        email: "huaripayta29.92@gmail.com",
        fecha: 43926
    },
    {
        _id: "5ea6e0e0b407d2140c5956e9",
        Nombre: "Eddie",
        Apellidos: "Huaripayta",
        dni: "1234567",
        email: "libra_pshg@hotmail.com",
        fecha: 43926
    },
];

const addProperty = (arrObj) => {
    let newArray = [];
    arrObj.map((property) => {
        const newObj = {... property,
            startSesion: { estado: true },
            password: bcrypt.hashSync(property.dni, 10)}
        newArray.push(newObj);
    });
    return newArray;
};

console.log(addProperty(arrObj3));