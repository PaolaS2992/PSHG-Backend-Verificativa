const sgMail = require('@sendgrid/mail');

function getArrEmail(arrObjTotal){
    let soloEmail = arrObjTotal.candidatos;
    let newArrEmail = [];
    Object.keys(soloEmail).forEach((key) => {
        newArrEmail.push(soloEmail[key].email);
    });  
    return newArrEmail;
}

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

const functionEmail = {
    sendMasivoEmail
};

module.exports = functionEmail;