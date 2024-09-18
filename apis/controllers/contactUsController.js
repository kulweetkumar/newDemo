const db = require("../models");
const helper = require("../helper/helper");
const { Validator } = require("node-input-validator");
const sequelize = require("sequelize");
const Contactus = db.contectus;
module.exports = {
    contactus: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                name: "required",
                email: "required",
                comment: "required",
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }
            req.body.user_id = req.auth.id
            const Contact = await Contactus.create(req.body);

            let find_contactus = await Contactus.findOne({
                where: {
                    id: Contact.dataValues.id,
                },
                raw: true,
            });

            if (Contact) {
                return helper.success(
                    res,
                    " Contactus Get Succesfully ",
                    find_contactus
                );
            }
        } catch (error) {
            return helper.error403(res, error);
        }
    },

  
};
