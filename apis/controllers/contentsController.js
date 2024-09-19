const db = require("../models");
const helper = require("../helper/helper");
const Content = db.contents;
const he = require('he');
const sequelize = require("sequelize");

const Op = sequelize.Op;
const users = db.users;
const socketuser = db.socketuser;
const rideRequest = db.ride_requests;
const orders = db.orders;
const addresses = db.addresses;
const order_details = db.order_details;
const cards = db.cards;
const products = db.products;
module.exports = {
    privacypolicy: async (req, res) => {
        try {
            const privacypolicy = await Content.findOne({
                where: {
                    id: 1,
                },
            });

            if (privacypolicy) {
                return helper.success(
                    res,
                    " Privacypolicy Get Succesfully ",
                    privacypolicy
                );
            }
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    termsAndConditions: async (req, res) => {
        try {
            const termsAndConditions = await Content.findOne({
                where: {
                    id: 2,
                },
            });

            if (termsAndConditions) {
                return helper.success(
                    res,
                    " TermsAndConditions Get Succesfully ",
                    termsAndConditions
                );
            }
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    aboutus: async (req, res) => {
        try {
            const aboutus = await Content.findOne({
                where: {
                    id: 3,
                },
            });
            if (aboutus) {
                return helper.success(
                    res,
                    " AboutUs Get Succesfully ",
                    aboutus
                );
            }
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    getfaqs: async (req, res) => {
        try {
            let getfaqs = await db.faqs.findAll({});

            return helper.success(res, "Faqs get sucssfully", getfaqs);
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    pagesUrl: async (req, res) => {
        try {
            const privacypolicy = await Content.findOne({
                where: {
                    id: req.query.type,
                }, raw: true
            });
            if (privacypolicy) {
                privacypolicy.title = privacypolicy.title;
                privacypolicy.description = he.decode(privacypolicy.description);
                res.render('pages', { privacypolicy, he })
            }
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    testPush: async (req, res) => {
        try {
              let  notification_data= {
                    deviceToken: req.body.deviceToken,
                    deviceType: req.body.deviceType,
                    message: "Its testing push notification",
                    userid: 1,
                    sender_name: "testing user",
                    sender_image: "test.image",
                    push_type: 0,
                    role: req.body.role,
                    order_id: 0,
                    ride_id: 0,
                    receiver_name: "get_user2.name",
                    receiver_image: "get_user2.image",
                }
            const data = await helper.sendPushNotification(notification_data);
            return helper.success(
                res,
                "testing push ",
                data
            );
        } catch (error) {
            return helper.error400(res, error)
        }
    }
};