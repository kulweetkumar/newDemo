require('dotenv').config();
const config = require('../config/config.js');
const path = require('path');
var uuid = require('uuid').v4;
const sequelize = require('sequelize');
let jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../models');
const Op = sequelize.Op;
var FCM = require('fcm-node');
const user = db.users;
const Card = db.cards;
const products = db.products;
const apn = require('apn');
const envfile = process.env;
const stripe = require('stripe')(config.paymentConst.PAYMENTMODE == 1 ? envfile.SECRETKEYLIVE : envfile.SECRETKEYTEST);
const paypal = require('paypal-rest-sdk');
paypal.configure({
  mode: process.env.MODE, //sandbox
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
});
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);
const stripeReturnUrl = "https://app.nooniqapp.com/admin/stripe_connect"


module.exports = {
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //   Api  authtication helper   // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //   Api  authtication helper End  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //

  checkValidation: async v => {
    var errorsResponse;
    await v.check().then(function (matched) {
      if (!matched) {
        var valdErrors = v.errors;
        var respErrors = [];
        Object.keys(valdErrors).forEach(function (key) {
          if (valdErrors && valdErrors[key] && valdErrors[key].message) {
            respErrors.push(valdErrors[key].message);
          }
        });
        // errorsResponse = respErrors.join(', ');
        errorsResponse = respErrors.length > 0 ? respErrors[0] : '';
      }
    });
    return errorsResponse;
  },
  error403: function (res, err) {
    let code = typeof err === 'object'
      ? err.statusCode ? err.statusCode : err.code ? err.code : 403
      : 403;
    let message = typeof err === 'object' ? err.message : err;
    res.status(code).json({
      success: false,
      message: message,
      code: code,
      body: {},
    });
  },
  error400: function (res, err) {
    let code = typeof err === 'object'
      ? err.statusCode ? err.statusCode : err.code ? err.code : 400
      : 400;
    let message = typeof err === 'object' ? err.message : err;
    res.status(code).json({
      success: false,
      message: message,
      code: code,
      body: {},
    });
  },
  vaildObject: async function (required, non_required, res) {
    let msg = '';
    let empty = [];
    let table_name = required.hasOwnProperty('table_name')
      ? required.table_name
      : 'users';

    for (let key in required) {
      if (required.hasOwnProperty(key)) {
        if (required[key] == undefined || required[key] == '') {
          empty.push(key);
        }
      }
    }
    if (empty.length != 0) {
      msg = empty.toString();
      if (empty.length > 1) {
        msg += ' fields are required';
      } else {
        msg += ' field is required';
      }
      res.status(400).json({
        success: false,
        message: msg,
        code: 400,
        body: {},
      });
      return;
    } else {
      if (required.hasOwnProperty('security_key')) {
        if (required.security_key != '') {
          msg = 'Invalid security key';
          res.status(403).json({
            success: false,
            message: msg,
            code: 403,
            body: [],
          });
          res.end();
          return false;
        }
      }
      if (required.hasOwnProperty('password')) {
        const marge_object = Object.assign(required, non_required);
        delete marge_object.checkexit;
        for (let data in marge_object) {
          if (marge_object[data] == undefined) {
            delete marge_object[data];
          } else {
            if (typeof marge_object[data] == 'string') {
              marge_object[data] = marge_object[data].trim();
            }
          }
        }
      }
      return marge_object;
    }
  },
  success: function (res, message, body = {}) {
    return res.status(200).json({
      success: true,
      code: 200,
      message: message,
      body: body,
    });
  },
  fileUpload: (file, folder) => {
    if (file) {
      var extension = path.extname(file.name);
      var filename = uuid() + extension;
      file.mv(
        process.cwd() + `/public/images/${folder}/` + filename,
        function (err) {
          if (err) return err;
        }
      );
    }
    let url = `/images/${folder}/${filename}`;
    return url;
  },


  verifyUser: async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        return res.status(401).json({
          success: false,
          status: 401,
          message: 'Token Missing',
        });
      } else {
        const accessToken = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(accessToken, 'secret');
        const data = await user.findOne({
          where: {
            id: decoded.id,
          },
          raw: true,
        });
        if (data.id == decoded.id) {
          req.auth = data;
          if (next == 1) {
            return req.auth;
          } else {
            return next();
          }
        } else {
          return res.status(401).json({
            success: false,
            status: 401,
            message: 'Invalid Token',
          });
        }
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: error,
      });
    }
  },
  verifykey: async (req, res, next) => {
    try {
      if (!req.headers.secret_key && !req.headers.publish_key) {
        return await module.exports.error400(res, 'Key not found!');
      }
      if (
        req.headers.secret_key !== envfile.SECRET_KEY ||
        req.headers.publish_key !== envfile.PUBLISH_KEY
      ) {
        return await module.exports.error403(res, 'Key not matched!');
      }
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: 'Invalid Token',
      });
    }
  },
  strieCustomer: async email => {
    const customer = await stripe.customers.create({
      email: email,
    });
    return customer.id;
  },

  stripeToken: async (req, expiry_month, expiry_year) => {
    const token = await stripe.tokens.create({
      card: {
        number: req.body.card_number,
        exp_month: expiry_month,
        exp_year: expiry_year,
      },
    });
    const source = await stripe.customers.createSource(req.auth.verify_driver, {
      source: token.id,
    });

    return source ? source.id : 0;
  },
  stripePayment: async (order) => {
    try {
      const customer = await stripe.customers.retrieve(order.orderUser.stripe_id);
      if (customer) {
        var stripe_id = order.orderUser.stripe_id

      }
    } catch (error) {
      const customerData = await module.exports.strieCustomer(order.orderUser.email);
      var stripe_id = customerData;
      let update = await user.update(
        {
          stripe_id: stripe_id
        },
        {
          where: {
            email: order.orderUser.email,
          },
        }
      );
    }
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: stripe_id },
      { apiVersion: '2020-08-27' }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt((order.total * 100).toFixed(0)),
      currency: 'USD',
      customer: stripe_id,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    let obj = { ephemeralKey: ephemeralKey, paymentIntent: paymentIntent, stripe_id: stripe_id }
    return obj;
  },
  stripePaymentold: async (req, res) => {
    const cardDetail = await Card.findOne({
      where: {
        id: req.body.card_id,
      },
      raw: true,
    });
    var charge = await stripe.charges.create({
      amount: req.body.total * 1000,
      currency: 'usd',
      customer: req.auth.verify_driver,
      source: cardDetail.stripe_card_id,
      description: 'New Demo',
    });
    return charge;
  },
  paypalPayment: (order, req, item) => {
    return new Promise(async (resolve, reject) => {
      try {
        var formattedProducts = item.map(product => {
          return {
            price: parseFloat(product.price).toFixed(2),
            quantity: parseInt(product.quantity),
          };
        });
        var totalQuantity = formattedProducts.reduce(
          (sum, product) => sum + product.quantity,
          0
        );

        await paypal.payment.create(
          {
            intent: 'sale',
            payer: {
              payment_method: 'paypal',
            },
            redirect_urls: {
              return_url: `${req.protocol}://${req.get('host')}/api/paypalSuccessURL?amount=${parseFloat(order.total)}&orderId=${parseInt(order.id)}&status=1`,
              cancel_url: `${req.protocol}://${req.get('host')}/api/cancleUrl?status=0`,
            },
            transactions: [
              {
                item_list: {
                  items: [
                    {
                      name: '',
                      price: order.total,
                      currency: 'USD',
                      quantity: 1,
                    },
                  ],
                },
                amount: {
                  total: order.total,
                  currency: 'USD',
                },
                description: 'Payment description',
              },
            ],
          },
          (error, payment) => {
            if (error) {
              reject(error);
            } else {
              const approval_url = payment.links.find(
                link => link.rel === 'approval_url'
              ).href;
              resolve(approval_url);
            }
          }
        );
      } catch (error) {
        console.error('PayPal API Error:', error);
        reject(error);
      }
    });
  },
  SMTP: function (object) {
    var transporter = nodemailer.createTransport(config.mail_auth);
    console.log(transporter, 'transporter')
    var mailOptions = object;
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error, 'err')
        throw error;
      } else {
        console.log(message, 'message')
        throw message;
      }
    });
  },
  sendPushNotification: async function (dataForSend) {

    deviceType = dataForSend.role == 2 ? dataForSend.orderUser.device_type : dataForSend.orderDriver.device_type;
    deviceToken = dataForSend.role == 2 ? dataForSend.orderUser.device_token : dataForSend.orderDriver.device_token;
    type = dataForSend.notification_type;



    // deviceType = dataForSend.deviceType
    // deviceToken = dataForSend.deviceToken
    if (deviceToken) {

      if (dataForSend && deviceType == 1) {

        const options = {
          token: {
            key: __dirname + '/AuthKey_B2V6DNMKH9.p8',
            keyId: 'B2V6DNMKH9',
            teamId: 'RH4GVZ4PJ4',
          },
          production: true,
        };
        const sound = 'OrderAsignWav25.wav';
        const apnProvider = new apn.Provider(options);
        var myDevice = deviceToken;
        var note = new apn.Notification();
        note.sound = sound;
        note.title = 'New Demo';
        note.body = dataForSend.message;
        note.topic = dataForSend.role == 2 ? 'com.live.FoodGroceryUser' : 'com.live.FoodGroceryDriver';
        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 1;
        note.alert = dataForSend.message;
        var payload = {
          aps: {
            alert: note.alert,
            title: note.title,
            sound: 'default',
          },
          payload: dataForSend,
        };
        note.payload = payload
        apnProvider
          .send(note, myDevice)
          .then(result => {
            return result;
            console.error('Push send successfully:', result);
          })
          .catch(err => {
            console.error('error while sending user notification', err);
            return err;
          });

      } else {

        // andriod push notification
        var message = {
          to: deviceToken,
          // to:'df9EdwlgRZ6vu6noMyrOWg:APA91bHcuJqc_55NV8kXesapr76jJ0pdbPYYBdtfQNAWTqZEyqQn9B8ElRQeCyC6uiENnryqW3sjhYl9whOVr5JnUeMAH8zuSw9c2dyXKfhwW5OYDhvwRbm3J0LhrAlfS7OA1Dovghi0',
          // notification: {
          //   title: 'New Demo',
          //   body: dataForSend,
          //   device_token: deviceToken,
          //   device_type: deviceType,
          //   type: type,
          // },
          data: {
            title: 'New Demo',
            body: dataForSend,
            message: dataForSend.message,
            device_token: deviceToken,
            device_type: deviceType,
            type: type,

          },
        };

        var serverKey =
          'AAAAa65RwLA:APA91bEOvVOliQmHidSOxxsACv3Od2TumAljU8xIasbNOFgn8WX2XesHLmTQbx-0ZzQEHELJB3YMnhgs3L2G5_0LrXX3AQCtpEGHLwjtM0Z8c1Fe9QEF440_rn6qmQWqfnJKcll2E3pp';
        var fcm = new FCM(serverKey);

        await fcm.send(message, function (err, response) {
          if (err) {
            console.log(err, 'responseresponseresponse');
            throw err;
          } else {
            console.log(response, 'responseresponseresponse');

            return
            throw message;

          }
        });

      }
    }
    return true;
  },

  sendMessageUseTwilio: async function (requestdata, OTP) {
    try {
      const data = await client.messages
        .create({
          body: `Your New Demo one time otp is :  ${OTP}`,
          to: requestdata, // Text your number
          from: process.env.TWILIOPHONE, // From a valid Twilio number
        });
      if (data.status == 'queued') {
        return OTP;
      } else {
        return false
      }

    } catch (error) {
      console.log(error);
      return false
    }
  },
  twilioVerify: async function (requestdata) {
    try {
      const result = await client.verify.v2.services(process.env.SID)
        .verificationChecks
        .create({ to: requestdata.phone, code: requestdata.code });
      return result;
    } catch (error) {
      console.error(' API Error:', error);
    }
  },
  getStoreId: async function (req, res) {
    let condition = { status: 1 }
    if (req.body.categoryId) {
      condition = {
        category_id: req.body.categoryId
      }
    }
    if (req.body.keyword) {
      condition = {
        name: {
          [Op.like]: `%${req.body.keyword}%`,
        },
      }
    }
    let find_products = await products.findAll({
      where: condition,
      attributes: [
        'store_id',
      ], raw: true,
      group: ["store_id"],
    });
    let storeId = [];
    if (find_products.length > 0) {
      find_products.map(async (items) => {
        storeId.push(items.store_id);
      });
    };
    return storeId;
  },
  create_stripe_connect_url: async function (getUser, stripeReturnUrl) {
    try {
      let account;
      let accountLink;
      let hasAccountId = '0';

      if (getUser?.hasAccountId == 0) {
        account = await stripe.accounts.create({
          country: 'US',
          type: 'express',
          email: getUser?.email,
          capabilities: {
            card_payments: {
              requested: true,
            },
            transfers: {
              requested: true,
            },
          },
          business_profile: {
            url: stripeReturnUrl,
          },
        });
        accountLink = await stripe.accountLinks.create({
          account: account?.id,
          refresh_url: stripeReturnUrl,
          return_url: stripeReturnUrl,
          type: 'account_onboarding',
        });

        hasAccountId = '0'
      } else {
        account = await stripe.accounts.retrieve(
          getUser?.stripeAccountId
        );
        if (account?.charges_enabled == false) {
          accountLink = await stripe.accountLinks.create({
            account: account?.id,
            refresh_url: stripeReturnUrl,
            return_url: stripeReturnUrl,
            type: 'account_onboarding',
          });

          hasAccountId = '0'
        } else {
          hasAccountId = '1'
        }
      }
      const update_user = await user.update(
        {
          stripeAccountId: account?.id,
          hasAccountId: hasAccountId
        },
        {
          where: {
            id: getUser.id
          }
        }
      );

      return accountLink
    } catch (err) {
      console.log(err, '======================================');
      throw err
    }
  },

  sendotptem: async function (name, otp) {
    let tem = `<!DOCTYPE html>
    <html>

    <head>
      <title>New Demo</title>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
      <style>
        * {
          padding: 0;
          margin: 0;
          font-family: 'Poppins', sans-serif;
          border-collapse: collapse;
        }
      </style>
    </head>



    <body>

      <div style="width: 530px;margin: auto;border-radius: 13px;box-shadow: 0px 0px 3px #ddd;">
        <div style=" text-align: center;padding: 30px 30px;box-sizing: border-box;background: url(https://app.azonwheels.com/images/users/back.png);background-position: bottom right;background-size: cover;">
        <table>
          <tbody>
          <tr>
            <td>
            <div style="background: rgba(255, 255, 255, 0.8); box-sizing: border-box; padding: 22px 30px; border-radius: 50px;box-shadow: 0px 0px 9px #ddd;margin-top: 0px;">
              <p><img src="https://app.azonwheels.com/images/users/logo.png" alt="" style="width: 190px;border-radius: 20px;/*! background: #fff; */padding: 20px 10px;margin-bottom: 10px;"> </p>

              <table>
                <tbody>
                  <tr>
                  <td style="padding: 0px 0 15px;">
                    <h3 style="font-size: 27px;color: #000;text-transform: uppercase;margin-top: 20px;">Welcome ${name} </h3>
                  </td>
                  </tr>
                  <tr>
                  <td style="padding: 0px 0 0px;color: #000;">Thank you for choosing New Demo. Use the following OTP to complete your Sign Up procedures.
                  </td>
                  </tr>
                  <tr>
                  <td style="color: #ff3007;font-size: 63px;font-weight: bold;letter-spacing: 30px;padding: 17px 0px;">${otp}
                  </td>
                  </tr>


                  <tr>
                  <td style="padding: 0 0 30px;color: #090909;font-size: 12px;letter-spacing: 2px;font-weight: 600;">Have fun.</td>
                  </tr>
                </tbody>
                </table>
            </div>
            </td>
          </tr>
          </tbody>
        </table>

        </div>
        </div>


    </body>


    </html>`
    return tem

  },
  forgot: async function (link) {
    let tem = `<!DOCTYPE html>
    <html>

    <head>
      <title>New Demo</title>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
      <style>
        * {
          padding: 0;
          margin: 0;
          font-family: 'Poppins', sans-serif;
          border-collapse: collapse;
        }
      </style>
    </head>

    <body>

      <div style="width: 530px;margin: auto;border-radius: 13px;box-shadow: 0px 0px 3px #ddd;">
        <div style=" text-align: center;padding: 30px 30px;box-sizing: border-box;background: url(https://app.azonwheels.com/images/users/back.png);background-position: bottom right;background-size: cover;">
        <table>
          <tbody>
          <tr>
            <td>
            <div style="background: rgba(255, 255, 255, 0.8); box-sizing: border-box; padding: 22px 30px; border-radius: 50px;box-shadow: 0px 0px 9px #ddd;margin-top: 0px;">
              <p><img src="https://app.azonwheels.com/images/users/logo.png" alt="" style="width: 200px;border-radius: 20px;/*! background: #fff; */padding: 20px 10px;margin-bottom: 20px;"> </p>

              <img src="lock.png" alt="" style="width: 80px;border-radius: 20px;margin-bottom: 30px;">			  <table>
              <tbody>
                <tr>
                <td style="padding: 0px 0 15px;">
                  <h3 style="font-size: 27px;color: #ff3008;text-transform: uppercase;margin-top: 0px;">Reset Password </h3>
                </td>
                </tr>
                <tr>
                <td style="padding: 0px 0 0px;color: #000;">If you've lost your password or wish to reset it, use the link to get started.
                </td>
                </tr>
                <tr>
                <td style="padding: 0px 0 0px;color: #fff;"><p> <a href="${link}" target="_blank" class="link c-white" style="display: block; padding: 15px 35px; text-decoration:none; color:#fff;background-image:linear-gradient(#ff3008, #641212);border-radius: 10px;font-weight: bold;font-size: 17px;width: 50%;margin: 0 auto;margin-top: 20px;">
                  Reset your Password
                </a>
              </p>
                </td>
                </tr>


                <tr>
                <td style="padding: 0 0 30px;color: #090909;font-size: 12px;letter-spacing: 2px;font-weight: 600;">Have fun.</td>
                </tr>
              </tbody>
              </table>
            </div>
            </td>
          </tr>
          </tbody>
        </table>

        </div>
        </div>

    </body>

    </html>`
    return tem

  }

}
