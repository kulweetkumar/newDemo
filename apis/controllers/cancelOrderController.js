const db = require ('../models');
const helper = require ('../helper/helper.js');
const users = db.users;
const socketuser = db.socketuser;
const {Validator} = require ('node-input-validator');
const orders = db.orders;
const rideRequest = db.ride_requests;

module.exports = {
  cancelOrder: io => {
    return async (req, res) => {
      const v = new Validator (req.body, {
        order_id: 'required',
      });
      let errorsResponse = await helper.checkValidation (v);
      if (errorsResponse) {
        return helper.error403 (res, errorsResponse);
      }
      const find_order = await orders.findOne ({
        where: {
          id: req.body.order_id,
        },
        raw: true,
      });
      if (find_order) {
        await orders.update (
          {status: req.body.status},
          {
            where: {
              id: req.body.order_id,
            },
          }
        );
        let updateOrder = await db.orders.findOne ({
          where: {
            id: req.body.order_id,
          },
        });
        if (updateOrder.driver_id) {
          await rideRequest.update (
            {
              status: req.body.status,
            },
            {
              where: {
                driver_id: updateOrder.driver_id,
                order_id: updateOrder.id,
              },
            }
          );
       const updataDriverStatus =   await db.users.update({
            job_status:0
        },{where:{
            id:updateOrder.driver_id
        }});
          let find_shocketId = await socketuser.findOne ({
            where: {
              user_id: updateOrder.driver_id,
            },
            raw: true,
          });
          io.to (find_shocketId && find_shocketId.socket_id)
            .emit ('cancelOrder', updateOrder);
        }

        const pushData = await db.orders.findOne ({
          include: [
            {
              model: users,
              as: 'orderUser',
              attributes: [`id`, `role`, `name`, `device_type`, `device_token`],
            },
            {
              model: users,
              as: 'orderDriver',
              attributes: [`id`, `role`, `name`, `device_type`, `device_token`],
            },
          ],
          where: {
            id: req.body.order_id,
          },
          raw: true,
          nest: true,
        });
        pushData.message = 'User has cancelled your order';
        pushData.role = 3; // 3 for driver 2 for user
        pushData.notification_type = 8; // 8 user cancel order
        await helper.sendPushNotification (pushData);
        return helper.success (
          res,
          'order status updated successfully',
          updateOrder
        );
      } else {
        return helper.error400 (res, 'order not found');
      }
    };
  },
};
