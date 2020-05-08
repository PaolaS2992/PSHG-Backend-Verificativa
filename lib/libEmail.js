const sgMail = require('@sendgrid/mail');

function getArrEmail(arrObjTotal){
    let soloEmail = arrObjTotal.candidates;
    let newArrEmail = [];
    Object.keys(soloEmail).forEach((key) => {
        newArrEmail.push(soloEmail[key].email);
    });
    return newArrEmail;
}

const sendMasivoEmail = (arrEmail) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: arrEmail,
        from: 'phuaripayta@gmail.com',
        subject: 'varios - Envio de correos VERIFICATIVA',
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

const sendEmail = (email) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
    to: email,
    from: 'phuaripayta@gmail.com',
    subject: 'Individual - Envio de correos VERIFICATIVA',
    text: 'and easy to do anywhere, even with Node.js !!!',
        html: `<strong>Bienvenido, ingresa !!!</strong>
            <a href='https://plataforma.verificativa.com/login'>Ingresa aqui</a>
        `,
    };
    sgMail.send(msg);
};

const functionEmail = {
    sendMasivoEmail,
    sendEmail
};

module.exports = functionEmail;