const db = require("../models");
const helper = require("../helper/helper");
const { Validator } = require("node-input-validator");
const sequelize = require("sequelize");
const Card = db.cards;

module.exports = {
  ///add card
addcard: async function (req, res) {
    try {
        const v = new Validator(req.body, {
            card_name: "required",
            card_number: "required|integer",
            card_expiry_date: "required",
            cvv: "required|integer",
        });
        let errorsResponse = await helper.checkValidation(v);
        if (errorsResponse) {
            return helper.error403(res, errorsResponse);
        }
        let month = req.body.card_expiry_date.split("/")[0];
        let year = req.body.card_expiry_date.split("/")[1];
        req.body.user_id = req.auth.id;
        const cardToken = await helper.stripeToken(req,month,year);
        req.body.stripe_card_id = cardToken;

        const dataExist = await Card.findOne({where:{user_id:req.auth.id,card_number:req.body.card_number},raw:true});

        if(dataExist){
            var add_card = await Card.update(
                req.body,
               { where:{
                    id:dataExist.id
                }});
        }else{
            var add_card = await Card.create(req.body);
        }
        const findCard = await Card.findOne({where:{id:dataExist?dataExist.id:add_card.id}});
        return helper.success(res, "Card Add Succesfully", findCard);
    } catch (error) {
        helper.error403(res, error);
    }
},
cardlisting: async (req, res) => {
    try {
        const cardslisting = await Card.findAll({
            where: {
                user_id: req.auth.id,
                deleted_at: null,
            },
        });
        return helper.success(
            res,
            "Get Your Card Is succesfully ",
            cardslisting
        );
    } catch (error) {
        return helper.error403(res, error);
    }
},
default_card: async (req, res) => {
    try {
        const v = new Validator(req.body, {
            id: "required",
        });
        let errorsResponse = await helper.checkValidation(v);
        if (errorsResponse) {
            return helper.error403(res, errorsResponse);
        }
        const update = await Card.update(
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
        const updatted = await Card.update(
            {
                isDefault: 1,
            },
            {
                where: {
                    id: req.body.id,
                },
            }
        );
        const find_card = await Card.findOne({
            where: {
                id: req.body.id,
            },
            raw: true,
            nest: true,
        });

        return helper.success(
            res,
            "Set Default  card Succesfully",
            find_card
        );
    } catch (error) {
        return helper.error403(res, error);
    }
},
delete_card: async (req, res) => {
    try {
        const v = new Validator(req.body, {
            id: "required",
        });
        let errorsResponse = await helper.checkValidation(v);
        if (errorsResponse) {
            return helper.error403(res, errorsResponse);
        }

        const deletedTimeStamp = sequelize.literal("CURRENT_TIMESTAMP");
        const updatted = await Card.update(
            {
                deletedAt: deletedTimeStamp,
            },
            {
                where: {
                    id: req.body.id,
                },
            }
        );

        return helper.success(res, "Delete card Succesfully");
    } catch (error) {
        return helper.error403(res, error);
    }
},
updateCard: async (req, res) => {
    try {
        const v = new Validator(req.body, {
            id: "required",
        });
        let errorsResponse = await helper.checkValidation(v);
        if (errorsResponse) {
            return helper.error403(res, errorsResponse);
        }

        const findCard = await Card.findOne({
            where: {
                id: req.body.id,
            },
            raw: true,
        });
        if (!findCard) {
            throw "Invalid cardId.";
        }
        const add_card = await Card.update(req.body, {
            where: {
                id: req.body.id,
            },
        });
        const update_card = await Card.findOne({
            where: {
                id: req.body.id,
            },
            raw: true,
            nest: true,
        });
        return helper.success(
            res,
            " Card update Succesfully ",
            update_card
        );
    } catch (err) {
        return helper.error403(res, err);
    }
},



}