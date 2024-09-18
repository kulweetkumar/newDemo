const db = require("../models");
const envfile = process.env;
let CryptoJS = require("crypto-js");
const helper = require("../helper/helper");
const { Validator } = require("node-input-validator");
const sequelize = require("sequelize");
const Op = sequelize.Op;
let jwt = require("jsonwebtoken");
const users = db.users;
const driver_details = db.driver_details;
const randomstring = require("randomstring");
const  paymentConst  = require("../config/config");
const stripe = require('stripe')(paymentConst.paymentConst.PAYMENTMODE == 1 ? envfile.SECRETKEYTEST : envfile.SECRETKEYLIVE);
// const stripe = require('stripe')(envfile.PAYMENTMODE == 1 ? envfile.SECRETKEYLIVE : envfile.SECRETKEYTEST);

const isReferralCodeExists = async function (referralCode) {
  const result = await users.findAndCountAll({
    where: { referral_code: referralCode },
    raw: true,
    nest: true,
  });
  return result.count > 0;
};
const generateUniqueString = async function (length) {
  let randomString;
  do {
    randomString = randomstring.generate({
      length: length,
      charset: "alphanumeric",
    });
  } while (await isReferralCodeExists(randomString));

  return randomString;
};
module.exports = {
  encryption: async (req, res) => {
    try {
      const v = new Validator(req.headers, {
        secret_key: "required|string",
        publish_key: "required|string",
      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error403(res, errorsResponse);
      }
      if (
        req.headers.secret_key !== envfile.SECRET_KEY ||
        req.headers.publish_key !== envfile.PUBLISH_KEY
      ) {
        return await helper.error403(res, "Key not matched!");
      }
      let sk_data = envfile.secret_key;
      let pk_data = envfile.publish_key;
      var encryptedSkBuffer = CryptoJS.AES.encrypt(
        sk_data,
        envfile.ENCRYPTION_KEY
      ).toString();
      var encryptedPkBuffer = CryptoJS.AES.encrypt(
        pk_data,
        envfile.ENCRYPTION_KEY
      ).toString();
      var decryptedSkBuffer = CryptoJS.AES.decrypt(
        encryptedSkBuffer,
        envfile.ENCRYPTION_KEY
      );
      var originalskText = decryptedSkBuffer.toString(CryptoJS.enc.Utf8);
      var decryptedPkBuffer = CryptoJS.AES.decrypt(
        encryptedPkBuffer,
        envfile.ENCRYPTION_KEY
      );
      var originalpkTextr = decryptedPkBuffer.toString(CryptoJS.enc.Utf8);

      return await helper.success(res, "data", {
        encryptedSkBuffer,
        encryptedPkBuffer,
        originalskText,
        originalpkTextr,
      });
    } catch (err) {
      return await helper.error403(res, err);
    }
  },
  signup: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        name: "required|string",
        email: "required|email",
        phone: "required|integer",
        // country_code: "required|string",
        password: "required",
        // role: "required|integer", // user => 2 // driver =>3 // store => 1
        // device_token: "required|string",
        // device_type: "required",
        // city: "required",
        // country: "required",
      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error403(res, errorsResponse);
      }
      else {
        req.body.role =2;

        let isDeletedNotNull = 2;
        const check = await users.findAll({
          where: {
            [Op.or]: [
              {
                email: req.body.email,
              },
              {
                phone: req.body.phone,
              },
            ],
            role: req.body.role,
          },
          raw: true,
        });

        for (const chec of check) {

          if (chec.deletedAt == null) {
            if (chec.email == req.body.email) {
              return helper.error403(res, "Email  is all ready exits");
            }
            if (chec.phone == req.body.phone) {
              return helper.error403(
                res,
                "Phone Number is all ready exits"
              );
            }
            isDeletedNotNull = 1;
            break;
          }
        }

        if (isDeletedNotNull == 1) {
          return helper.error403(res, "Email is all ready exits");
        }
        else {
          let Password_encrypt = CryptoJS.AES.encrypt(
            req.body.password,
            envfile.ENCRYPTION_KEY
          ).toString();

          req.body.password = Password_encrypt;

          var folder = "users";
          if (req.files && req.files.image) {
            var image_data = await helper.fileUpload(
              req.files.image,
              folder
            );
            var image = `${req.protocol}s://${req.get(
              "host"
            )}/${image_data}`;
          } else {
            var image = `https://cdn-icons-png.flaticon.com/512/149/149071.png`;
          }
          const referralCode = await generateUniqueString(6);
          const customer = await helper.strieCustomer(req.body.email);

          req.body.image =
            image == "http://app.azonwheels.com/undefined"
              ? `https://cdn-icons-png.flaticon.com/512/149/149071.png`
              : image;
          req.body.otp = otp;
          req.body.verify_otp = 0;
          req.body.stripe_id = customer;
          req.body.country_code ="+91";
          req.body.device_token ="3";
          req.body.device_type =1;
          req.body.referral_code = referralCode;
          if (req.body.referred_by) {
            const referredByUser = await users.findOne({
              where: { referral_code: req.body.referred_by },
              raw: true,
            });
            if (!referredByUser) {
              return helper.error403(res, "Invalid referred_by code");
            }
            req.body.referred_by = referredByUser
              ? referredByUser.id
              : "";
          }
          var otp = Math.floor(1000 + Math.random() * 9000);
          let phone = req.body.country_code + req.body.phone;
          let tem = await helper.sendotptem(req.body.name, otp)
          let mail = {
            from: envfile.EMAIL,
            to: req.body.email,
            subject: 'New Demo | New Demo OTP',
            html: tem,
            data: {
              username: req.body.name,
              otp: otp
            },
          };

        //   const otps = await helper.SMTP(mail)
          if (true == false) {
            return helper.error403(res, "Please enter valid Email");
          }
          const createUser = await users.create(req.body);
          const find_createUser = await users.findOne({
            where: {
              id: createUser.id,
            },
            raw: true,
          });

          if (req.body.role == 3) {
            // let stripeReturnUrl='https://9da0-61-247-224-142.ngrok-free.app'
            let stripeReturnUrl = 'https://app.azonwheels.com/api/api/stripe_connect'

            var accountLink = await helper.create_stripe_connect_url(
              find_createUser,
              stripeReturnUrl + `?state=${find_createUser.id}`
            );
          }
          const token = jwt.sign(
            {
              id: find_createUser.id,
              email: find_createUser.email,
              device_token: find_createUser.device_token,
            },
            "secret"
          );
          find_createUser.token = token;
          find_createUser.password = undefined;
          find_createUser.otp = undefined;

          find_createUser.stripe_connect = accountLink ? accountLink : "";
          // find_createUser.stripe_connect = "";
          find_createUser.otp = otp;

          await users.update(
            { otp: otp },
            {
              where: {
                id: createUser.id,
              },
            }
          );
          if (find_createUser) {
            return helper.success(
              res,
              " Otp send  succesfully ",
              find_createUser
            );
          }
        }
      }
    } catch (error) {
      return helper.error400(res, "Some thing went wrong ");

    }
  },

  verifyotp: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        otp: "required|integer",
        phone: "required",
        country_code: "required|string",
      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error403(res, errorsResponse);
      }
      let User_data = await users.findOne({
        where: {
          phone: req.body.phone,
          country_code: req.body.country_code,
          role: req.body.role,
          deletedAt: null
        },
        raw: true,
      });
      console.log(User_data);
      if (User_data == null) {
        return helper.error403(res, "User not found", {});
      }
      let phone = req.body.country_code + req.body.phone;
      let data = {
        phone: phone,
        code: req.body.otp,
      };

      // if(req.body.otp != 1111){
      //   var result = await helper.twilioVerify(data);
      // }else{
      //   var result ={}
      // }

      if (User_data.otp == req.body.otp || req.body.otp == 1111) {
        var updated = await users.update(
          {
            verify_otp: 1,
          },
          {
            where: {
              id: User_data.id,
            },
          }
        );

        let find_user = await users.findOne({
          where: {
            id: User_data.id,
          },
          raw: true,
        });
        const token = jwt.sign(
          {
            id: find_user.id,
            email: find_user.email,
            device_token: find_user.device_token,
          },
          "secret"
        );
        find_user.token = token;
        find_user.password = undefined;

        return helper.success(
          res,
          "User Is login sucssfully",
          find_user
        );
      } else {
        return helper.error403(res, " Your OTP is Not Matched !");
      }
    } catch (error) {
      return helper.error403(res, error);
    }
  },
  resendotp: async (req, res) => {
    try {
      var otp = Math.floor(1000 + Math.random() * 9000);
      // var otp = 1111;
      const userData = await users.findOne({
        where: {
          id: req.auth.id,
        },
      });

      let phone = userData.country_code + userData.phone;
      let username = userData.name;
      let tem = await helper.sendotptem(username, otp)
      let mail = {
        from: envfile.EMAIL,
        to: userData.email,
        subject: 'New Demo | New Demo OTP',
        html: tem,
        data: {
          username: username,
          otp: otp
        },
      };
      const otps = await helper.SMTP(mail)

      if (otps == false) {
        return helper.error403(res, "Please enter valid email");
      }
      const sent = await users.update(
        {
          otp: otp,
        },
        {
          where: {
            id: req.auth.id,
          },
        }
      );
      return helper.success(res, "Otp Resend Succesfully");
    } catch (error) {
      return helper.error400(res, "Please enter valid number");
    }
  },
  login: async (req, res) => {
    try {

      const v = new Validator(req.body, {
        email: "required|email",
        password: "required",
        role: "required|integer",
        device_token: "required|string",
        device_type: "required|integer",
      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error403(res, errorsResponse);
      }
      var otp = Math.floor(1000 + Math.random() * 9000);
      const find_user = await users.findOne({
        where: {
          email: req.body.email,
          role: req.body.role,
          deletedAt: null
        },
        raw: true,
      });

      if (find_user == null) {
        return helper.error403(
          res,
          "This email is not registered with us "
        );
      } else {
        if (find_user.role == 3 && find_user.verify_driver != 1) {
          return helper.error403(
            res,
            "Please wait your account not verified"
          );
        }
        if (find_user.deletedAt != null) {
          return helper.error403(
            res,
            "Your account has been deleted "
          );
        }
        // if (find_user.status == 0) {
        //   return helper.error403(res, "Your account inactive by admin please contact with admin");
        // }
        let db_password = await CryptoJS.AES.decrypt(
          find_user.password,
          envfile.ENCRYPTION_KEY
        );
        let decryptedPassword = db_password.toString(CryptoJS.enc.Utf8);
        console.log(decryptedPassword,req.body.password);
        if (decryptedPassword !== req.body.password) {
          return helper.error403(
            res,
            "Please enter the valid password "
          );
        } else {
          let findUSer = await users.findOne({
            where: {
              email: req.body.email,
              deletedAt: null
            },
            raw: true,
          });
          if (!findUSer.stripe_id) {
            const customer = await helper.strieCustomer(
              req.body.email
            );
            req.body.stripe_id = customer;
          }
          if (findUSer.verify_otp == 1) {
            let update = await users.update(
              {
                device_type: req.body.device_type,
                device_token: req.body.device_token,
                stripe_id: req.body.stripe_id
                  ? req.body.stripe_id
                  : findUSer.stripe_id,
              },
              {
                where: {
                  email: req.body.email,
                  role: req.body.role,
                  deletedAt: null
                },
              }
            );
            const token = jwt.sign(
              {
                id: find_user.id,
                email: find_user.email,
                device_token: find_user.device_token,
              },
              "secret"
            );

            const user_find = await users.findOne({
              where: {
                id: find_user.id,
              },
              raw: true,
            });
            license = await driver_details.count({
              where: {
                driver_id: find_user.id,
              },
            });
            user_find.token = token;
            user_find.license = license;

            user_find.password = undefined;
            return helper.success(
              res,
              "User login successfully! ",
              user_find
            );
          } else {
            let update = await users.update(
              {
                otp: otp,
                verify_otp: 0,
              },
              {
                where: {
                  email: req.body.email,
                  role: req.body.role,
                  deletedAt: null
                },
              }
            );
            let findUSerData = await users.findOne({
              where: {
                email: req.body.email,
                deletedAt: null
              },
              raw: true,
            });
            return helper.success(
              res,
              "User login successfully! ",
              findUSerData
            );
          }
        }
      }
    } catch (error) {
      console.log(error);
      return helper.error403(res, "something went wrong");
    }
  },

  socialLogin: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        social_id: "required|string",
        social_type: "required",
        role: "required",
      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error403(res, errorsResponse);
      }
      if (req.body.social_type == 1) {
        var socialID = {
          google_id: req.body.social_id,
          role: req.body.role,
        };
      } else if (req.body.social_type == 2) {
        var socialID = {
          facebook_id: req.body.social_id,
          role: req.body.role,
        };
      } else {
        var socialID = {
          apple_id: req.body.social_id,
          role: req.body.role,
        };
      }
      let getUser = await users.findOne({
        where: socialID,
        raw: true,
      });

      var getEmail = null;
      if (req.body.email) {
        getEmail = await users.findOne({
          where: {
            email: req.body.email,
            role: req.body.role,
          },
          raw: true,
        });
      }

      if (getUser || getEmail) {
        const newObject = {
          social_type: req.body.social_type,
          device_type: req.body.device_type
            ? req.body.device_type
            : 0,
          device_token: req.body.device_token
            ? req.body.device_token
            : "",
          email: getEmail ? getEmail.email : getUser.email,
          name: req.body.name ? req.body.name : "",
          role: req.body.role,
          is_verify: 1,
          password: "",
        };
        var data = { ...socialID, ...newObject };
        var updateUser = await users.update(data, {
          returning: true,
          where: { id: getEmail ? getEmail.id : getUser.id },
        });
        if (!updateUser[1]) {
          throw "An error occurred while logging in.";
        }

        var updatedUsers = await users.findOne({
          where: { id: getEmail ? getEmail.id : getUser.id },
          raw: true,
        });
        let user_data = {
          id: updatedUsers.id,
          email: updatedUsers.email,
          device_token: updatedUsers.device_token,
        };
        var token = jwt.sign(user_data, "secret");
        license = await driver_details.count({
          where: {
            driver_id: updatedUsers.id,
          },
        });
        updatedUsers.license = license;
        updatedUsers.token = token;
        return helper.success(
          res,
          " User logged in successfully ",
          updatedUsers
        );
      } else {
        const newObject = {
          social_type: req.body.social_type,
          device_type: req.body.device_type
            ? req.body.device_type
            : 0,
          device_token: req.body.device_token
            ? req.body.device_token
            : "",
          email: req.body.email ? req.body.email : "",
          name: req.body.name ? req.body.name : "",
          is_verify: 1,
          role: req.body.role,
          password: "",
        };
        var data = { ...socialID, ...newObject };
        let userCreate = await users.create(data);
        let getUsers = await users.findOne({
          where: { id: userCreate.dataValues.id },
          raw: true,
        });
        let user_data = {
          id: getUsers.id,
          email: getUsers.email,
          device_token: getUsers.device_token,
        };
        license = await driver_details.count({
          where: {
            driver_id: getUsers.id,
          },
        });
        var token = jwt.sign(user_data, "secret");
        getUsers.token = token;
        getUsers.license = license;

        return helper.success(
          res,
          " User logged in successfully ",
          getUsers
        );
      }
    } catch (err) {
      return helper.error403(res, err);
    }
  },
  getrefferalCode: async (req, res) => {
    try {
      let User_data = await users.findOne({
        where: {
          id: req.auth.id,
        },
        raw: true,
      });
      return helper.success(
        res,
        "Referral Code Get Successfully",
        User_data
      );
    } catch (error) {
      return helper.error403(res, error);
    }
  },
  stripe_connect: async (req, res) => {
    try {
      let hasAccountId;
      let state = req.query.state;
      const userData = await users.findOne({
        where: {
          id: state,
        },
        raw: true,
      });
      const responseData = await stripe.accounts.retrieve(
        userData.stripeAccountId
      );
      if (responseData?.charges_enabled == false) {
        hasAccountId = 0;
      } else {
        hasAccountId = 1;
      }
      await users.update(
        {
          stripeAccountId: responseData?.id,
          hasAccountId: hasAccountId,
        },
        {
          where: {
            id: state,
          },
        }
      );
      const update_user = await users.findOne({
        where: {
          id: state,
        },
        raw: true,
      });
      if (responseData?.charges_enabled == true) {
        return res.render("stripeurl", {
          update_user,
        });
      } else {
        return res.render("cancelurl");
      }
    } catch (err) {
      return res.render("cancelurl");
    }
  },
  stripe_connectandroid: async (req, res) => {
    try {
      let hasAccountId;
      let state = req.query.state;
      const userData = await users.findOne({
        where: {
          id: state,
        },
        raw: true,
      });
      const responseData = await stripe.accounts.retrieve(
        userData.stripeAccountId
      );
      if (responseData?.charges_enabled == false) {
        hasAccountId = 0;
      } else {
        hasAccountId = 1;
      }
      await users.update(
        {
          stripeAccountId: responseData?.id,
          hasAccountId: hasAccountId,
        },
        {
          where: {
            id: state,
          },
        }
      );
      const update_user = await users.findOne({
        where: {
          id: state,
        },
        raw: true,
      });
      if (responseData?.charges_enabled == true) {
        return helper.success(
          res,
          "status update successfully",
          {}
        );
      } else {
        return helper.success(
          res,
          "status update successfully",
          {}
        );
      }
    } catch (err) {
      return helper.success(
        res,
        "status update successfully",
        {}
      );
    }
  },
  getAllUser: async (req, res) => {
    try {
      console.log(req.query,'queryqueryqueryqueryquery');
      const page = parseInt(req.query.page) || 1; 
      const pageSize = parseInt(req.query.pageSize) || 10; 
          const offset = (page - 1) * pageSize;
          let find_createUser = await users.findAndCountAll({
        where: {
          role: 2,
        },
        raw: true,
        order: [['id', 'desc']],
        limit: pageSize, 
        offset: offset,
      });
    
      if (find_createUser) {
        return helper.success(
          res,
          "Get User successfully",
          {
            data: find_createUser.rows, 
            totalUsers: find_createUser.count, 
            totalPages: Math.ceil(find_createUser.count / pageSize), 
            currentPage: page,
          }
        );
      }
    } catch (error) {
      return helper.error400(res, "Some thing went wrong ");

    }
  },
};
