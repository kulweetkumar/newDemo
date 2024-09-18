const db = require("../models");
const envfile = process.env;
let CryptoJS = require("crypto-js");
const helper = require("../helper/helper");
const { Validator } = require("node-input-validator");
const sequelize = require("sequelize");
const users = db.users;
const driverDetails = db.driver_details;
const address = db.addresses;
const PasswordReset = db.password_resets
const Op = sequelize.Op;

module.exports = {

    editprofile: async (req, res) => {

        try {
            if (req.files && req.files.image) {
                var image_data = await helper.fileUpload(req.files.image, folder = "users");
            }
            let image = `${req.protocol}s://${req.get("host")}/${image_data}`;
            const updateData = await users.findOne({
                where: {
                    id: req.auth.id,
                },
                raw: true,
            });
            req.body.image = image;

            if (updateData) {
                if (updateData.email == req.body.email && updateData.id != req.auth.id) {
                    return helper.error403(res, 'Email is all ready exits');
                }

                if (updateData.phone == req.body.phone && updateData.id != req.auth.id) {
                    return helper.error403(res, 'Phone Number is all ready exits');
                }
            }
            const update = await users.update(req.body, {
                where: {
                    id: req.auth.id,
                },
                raw: true,
            });

            let updateduser = await users.findOne({
                where: {
                    id: req.auth.id,
                },
                raw: true,
                nest: true,
            });
            updateduser.password = undefined;
            return helper.success(
                res,
                "Profile Updated Succesfully",
                updateduser
            );
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    getprofile: async (req, res) => {
        try {
            const profile = await users.findOne({
                where: {
                    id: req.auth.id,
                },
                raw: true,
                nest: true,
            });

            if (profile.role == 3) {

                const driver_detais = await driverDetails.findOne({
                    where: {
                        driver_id: profile.id,
                    },
                    raw: true,
                    nest: true,
                });
                profile.driver_detais = driver_detais;

                return helper.success(
                    res,
                    "User Profile Get Succesfully",
                    profile
                );
            }

            // return
            return helper.success(res, "User Profile Get Succesfully", profile);
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    useraddress: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                // country_code:'required|string',
                country: "required|string",
                city: "required|string", // user => 2 //
                postal_code: "required|string",
                house_number: "required|string",
                location: "required|string",
                longitude: "required",
                latitude: "required",
                isDefault: "required",
                phone: "required",
                country_code: "required",
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }
            req.body.user_id = req.auth.id;
            const address_create = await address.create(req.body);

            const user_address = await address.findOne({
                where: {
                    id: address_create.dataValues.id,
                },
                raw: true,
                nest: true,
            });

            return helper.success(
                res,
                " User Address create Succesfully",
                user_address
            );
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    default_address: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                id: "required",
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }

            let update_address = await address.update(
                {
                    isDefault: 0,
                },
                {
                    where: {
                        user_id: req.auth.id,
                        isDefault: 1,
                    },
                }
            );

            let update_default = await address.update(
                {
                    isDefault: 1,
                },
                {
                    where: {
                        id: req.body.id,
                    },
                }
            );

            const find_address = await address.findOne({
                where: {
                    id: req.body.id,
                },
            });

            return helper.success(
                res,
                " User Set  Address Succesfully",
                find_address
            );
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    changepassword: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                oldpassword: "required",
                newpassword: "required",
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }

            const find_User = await users.findOne({
                where: {
                    id: req.auth.id,
                },
                raw: true,
                nest: true,
            });

            var User_password = CryptoJS.AES.decrypt(
                find_User.password,
                envfile.ENCRYPTION_KEY
            );
            var get_password = User_password.toString(CryptoJS.enc.Utf8);

            // return

            var compare = get_password == req.body.oldpassword;

            if (compare == false) {
                return helper.error403(res, "Old Password Is NOt Matched !");
            } else {
                let Password_encrypt = CryptoJS.AES.encrypt(
                    req.body.newpassword,
                    envfile.ENCRYPTION_KEY
                ).toString();

                const update = await users.update(
                    {
                        password: Password_encrypt,
                    },
                    {
                        where: {
                            id: req.auth.id,
                        },
                    }
                );
            }

            return helper.success(res, "Password Updated Is Succesfully !");
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    logout: async (req, res) => {
        try {
            const logout = await users.update(
                {
                    device_type: 0,
                    device_token: "",
                },
                {
                    where: {
                        id: req.auth.id,
                    },
                }
            );
            return helper.success(res, "LogOut Succesfully");
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    deleted_account: async (req, res) => {
        try {
            const deletedTimeStamp = sequelize.literal("CURRENT_TIMESTAMP");
            const deleted_data = await users.update(
                {
                    status: 2
                },
                {
                    where: {
                        id: req.auth.id,
                    },
                }
            );

            return helper.success(res, " Your Account Is Deleted Succesfully ");
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    passwordforget: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                email: "required",
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }

            const find_email = await users.findOne({
                where: {
                    email: req.body.email,
                },
                raw: true,
            });

            if (find_email == null) {
                return helper.error403(res, "This email is not registered with us");
            } else {

                let Email_find = await PasswordReset.findOne({
                    where: {
                        email: req.body.email,
                    },
                    raw: true,
                    nest: true,
                });
                var otp = Math.floor(1000 + Math.random() * 900000);

                if (Email_find) {
                    const update = await PasswordReset.update(
                        {
                            token: otp,
                        },
                        {
                            where: {
                                email: Email_find.email,
                            },
                        }
                    );
                } else {
                    const update = await PasswordReset.create({
                        token: otp,
                        email: req.body.email,
                    });
                }

                let getUrl = `${req.protocol}://${req.get(
                    "host"
                )}/chagepassword?token=${otp}`;

                let forgot = await helper.forgot(getUrl);
                let mail = {
                    from: envfile.EMAIL,
                    to: req.body.email,
                    subject: 'New Demo | New Demo Password Link',
                    html: forgot,
                };

                const datta = await helper.SMTP(mail);
                return helper.success(res, " Email Sent Successfully");
                // return helper.success(res, " Email Sent Successfully", {
                //     url: getUrl,
                // });
            }
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    updatepassword: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                password: "required",
                confirmPassword: "required",
                token: "required",
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }

            let Password = req.body.password;
            let ConfirmPassword = req.body.confirmPassword;

            let compare = Password == ConfirmPassword;


            // var User_password = CryptoJS.AES.decrypt(
            //     req.body.token,
            //     // "U2FsdGVkX18dL+aEwrvLANYXE+yX/IPbXpb1iP725fk=",
            //     envfile.ENCRYPTION_KEY
            // );
            // var get_password = User_password.toString(CryptoJS.enc.Utf8);

            // return

            const find_email = await PasswordReset.findOne({
                where: {
                    token: req.body.token,
                },
                raw: true,
            });
            if (find_email == null) {
                return res.render("cancel");
            } else {
                let Password_encrypt = CryptoJS.AES
                    .encrypt(req.body.password, envfile.ENCRYPTION_KEY)
                    .toString();
                let update = await users.update(
                    {
                        password: Password_encrypt,
                    },
                    {
                        where: {
                            email: find_email.email,
                        },
                        raw: true,
                    }
                );
                const deleted = await PasswordReset.destroy({
                    where: {
                        email: find_email.email,
                    },
                });
                return res.render("success");

            }
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    updatepasswordold: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                password: "required",
                confirmPassword: "required",
                token: "required",
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }

            let Password = req.body.password;
            let ConfirmPassword = req.body.confirmPassword;

            let compare = Password == ConfirmPassword;

            if (compare == true) {
                // var User_password = CryptoJS.AES.decrypt(
                //     req.body.token,
                //     // "U2FsdGVkX18dL+aEwrvLANYXE+yX/IPbXpb1iP725fk=",
                //     envfile.ENCRYPTION_KEY
                // );
                // var get_password = User_password.toString(CryptoJS.enc.Utf8);

                // return

                const find_email = await PasswordReset.findOne({
                    where: {
                        token: req.body.token,
                    },
                    raw: true,
                });


                if (find_email == null) {
                    const html = `
          <br/>
          <br/>
          <br/>
          <div style="font-size: 50px; color:red;" >
              <b><center>Link has been expired!</center><p>
          </div>
        `;
                    res.send(html);
                } else {
                    let Password_encrypt = CryptoJS.AES.encrypt(
                        Password,
                        envfile.ENCRYPTION_KEY
                    ).toString();

                    let update = await users.update(
                        {
                            password: Password_encrypt,
                        },
                        {
                            where: {
                                email: find_email.email,
                            },
                            raw: true,
                            nest: true,
                        }
                    );

                    const deleted = await PasswordReset.destroy({
                        where: {
                            email: find_email.email,
                        },
                    });

                    const html2 = `
          <br/>
          <br/>
          <br/>
          <div style="font-size: 50px; color:green;" >
              <b><center>Your password is update Suessfully</center><p>
          </div>
        `;
                    res.send(html2);
                }
            } else {
            }
        } catch (error) {
            return helper.error403(res, error);
        }
    },
};
