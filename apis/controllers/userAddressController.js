const db = require("../models");
const helper = require("../helper/helper");
const { Validator } = require("node-input-validator");
const sequelize = require("sequelize");
const store_details = db.store_details;
const users = db.users;
const products = db.products;
const categories = db.categories;
const banner_details = db.banner_details;
const orders = db.orders;
const order_details = db.order_details;
const cards = db.cards;
const addresses = db.addresses;

module.exports = {
get_address: async (req, res) => {
    try {
        const user_address = await addresses.findAll({
            where: {
                user_id: req.auth.id,
                deletedAt: null,
            },
            raw: true,
            nest: true,
        });

        return helper.success(
            res,
            " User Address find Succesfully",
            user_address
        );
    } catch (error) {
        return helper.error403(res, error);
    }
},
editaddress: async (req, res) => {
    try {
        const v = new Validator(req.body, {
            id: "required",
            phone:"required",
            country_code:"required",
        });
        let errorsResponse = await helper.checkValidation(v);
        if (errorsResponse) {
            return helper.error403(res, errorsResponse);
        }

        const address_edit = await addresses.update(req.body, {
            where: {
                id: req.body.id,
            },
        });

        const update_address = await addresses.findOne({
            where: {
                id: req.body.id,
            },
            raw: true,
            nest: true,
        });

        return helper.success(
            res,
            " User Address Update Succesfully",
            update_address
        );
    } catch (error) {
        return helper.error403(res, error);
    }
},
deletedaddress: async (req, res) => {
    try {
        const v = new Validator(req.body, {
            id: "required",
        });
        let errorsResponse = await helper.checkValidation(v);
        if (errorsResponse) {
            return helper.error403(res, errorsResponse);
        }

        deletedTimeStamp = sequelize.literal("CURRENT_TIMESTAMP");
        const address_edit = await addresses.update(
            {
                deletedAt: deletedTimeStamp,
            },
            {
                where: {
                    id: req.body.id,
                },
            }
        );

        return helper.success(
            res,
            " User Address Deleted Succesfully",
            address_edit
        );
    } catch (error) {
        return helper.error403(res, error);
    }
},
};
