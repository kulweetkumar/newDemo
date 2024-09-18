const db = require("../models");
const helper = require("../helper/helper");
const { Validator } = require("node-input-validator");
const users = db.users;
const notifications = db.notifications;
notifications.belongsTo (users, {
    foreignKey: 'sender_id',
  });
module.exports = {


    
  notificationStatus: async function (req, res) {
    try {
        const v = new Validator(req.body, {
            isnotification: "required|integer",
        });
        let errorsResponse = await helper.checkValidation(v);
        if (errorsResponse) {
            return helper.error403(res, errorsResponse);
        }
        let data_updated = await users.update(
            {
                notification_on: req.body.isnotification,
            },
            {
                where: {
                    id: req.auth.id,
                },
            }
        );

        return helper.success(
            res,
            "Status changed successfully",
            data_updated
        );
    } catch (error) {
        return helper.error403(res, error);
    }
},
notificationlist: async (req, res) => {
    try {
        await notifications.update({
            is_read:1
         },{
            where: {
                receiver_id: req.auth.id,
                is_read:0

            },
        });
        const find_notification = await notifications.findAll({
            include: [{
                model: users,
                attributes: ['name', 'image']
            }],
            where: {
                receiver_id: req.auth.id,
                // is_read:0
            },
        });
    
        return helper.success(
            res,
            " Notifications get  Succesfully",
            find_notification
        );
    } catch (error) {
        return helper.error403(res, error);
    }
},
notificationcount: async (req, res) => {
    try {
        const totalNotification = await notifications.count({
            where: {
                receiver_id: req.auth.id,
                deleted_at: null,
                is_read:0
            },
        });
        
        return helper.success(
            res,
            " Notifications count",
            {count:totalNotification}
        );
    } catch (error) {
        return helper.error403(res, error);
    }
},
};
