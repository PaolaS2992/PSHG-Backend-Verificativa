const sgMail = require('@sendgrid/mail');

/* const arrObj = [
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
]; */

/* function getArrEmail(arrObjTotal){
    let newArrEmail = [];
    Object.keys(arrObjTotal).forEach((key) => {
        newArrEmail.push(arrObjTotal[key].email);
    });  
    return newArrEmail;
} */
// console.log(getArrEmail(arrObj));

const arrObj = [
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

function getArrEmail(arrObjTotal){
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

console.log(getArrEmail(arrObj));


const sendMasivoEmail = (arrObjT) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: getArrEmail(arrObjT),
        from: 'phuaripayta@gmail.com',
        subject: 'Demo - Envio de correos VERIFICATIVA',
        text: 'and easy to do anywhere, even with Node.js',
        html: `<strong>Bienvenido, ingresa</strong>
            <a href='https://plataforma.verificativa.com/login'>Ingresa aqui</a>
        `,
    };
    sgMail.sendMultiple(msg)
      .then(() => {}, error => {
          console.log(error);
          if (error.response) {
              console.log(error.response.body)
          }
      });
};
// sendMasivoEmail(arrObj);

const functionEmail = {
    sendMasivoEmail
};

module.exports = functionEmail;