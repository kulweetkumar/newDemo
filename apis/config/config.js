let base_path = __dirname;
base_path= base_path.replace('config','');
require ('dotenv').config ();

module.exports = {
    mail_auth:{
    //   service: "mailtrap",
      host: process.env.SMTPHOST,
      port: process.env.SMTPPORT,
    //   secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      }
    },
    paymentConst: {
      PAYMENTMODE: 1
    }
}