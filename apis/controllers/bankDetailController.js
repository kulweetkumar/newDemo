const db = require("../models");
const helper = require("../helper/helper");
const { Validator } = require("node-input-validator");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const Banks = db.banks;
module.exports = {
    addbank: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                bank_name: "required",
                branch_name: "required",
                ifsc_code: "required",
                account_number: "required",
                account_holder_name:"required"
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }

            req.body.user_id = req.auth.id;
            let create_bank = await Banks.create(req.body);

            let find_bank = await Banks.findOne({
                where: {
                    id: create_bank.id,
                },
                raw: true,
            });

            return helper.success(res, "Bank is add sucssfully", find_bank);
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    getbank: async (req, res) => {
        try {
            let driver_banks = await Banks.findAll({
                where: {
                    user_id: req.auth.id,
                    deletedAt: null,
                },
                raw: true,
            });

            return helper.success(res, "Get is Bank  sucssfully", driver_banks);
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    deletebank: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                id: "required",
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }

            const findbank = await Banks.findOne({
                where: {
                    id: req.body.id,
                },
                raw: true,
            });

            if (findbank) {
                const deletedTimeStamp = sequelize.literal("CURRENT_TIMESTAMP");
                let findbank = await Banks.update(
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
                    "Bank deleted  sucssfully",
                    
                );
            } else {
                return helper.error403(res, " Bank Not Found !");
            }

            let deletedCard = await Banks.destroy({
                where: {
                    user_id: req.auth.id,
                    deletedAt: null,
                },
                raw: true,
            });

            return helper.success(res, "Get is Bank  sucssfully", driver_banks);
        } catch (error) {
            return helper.error403(res, error);
        }
    },

    default_bank: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                id: "required",
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }
    
            let update_address = await Banks.update(
                {
                    is_active: 0,
                },
                {
                    where: {
                        user_id: req.auth.id,
                        is_active: 1,
                    },
                }
            );

    
            let update_default = await Banks.update(
                {
                    is_active: 1,
                },
                {
                    where: {
                        id: req.body.id,
                    },
                }
            );
    
            const find_Bank = await Banks.findOne({
                where: {
                    id: req.body.id,
                },
            });
    
            return helper.success(
                res,
                " User Set  Bank Succesfully",
                find_Bank
            );
        } catch (error) {
            return helper.error403(res, error);
        }
    },

};
