const db = require('../models');
const helper = require('../helper/helper');
const schedule = require('node-schedule');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const users = db.users;
const socketuser = db.socketuser;
const rideRequest = db.ride_requests;
const orders = db.orders;
const order_details = db.order_details;
const addresses = db.addresses;
const products = db.products;
const Notifications = db.notifications;

module.exports = function (io) {
  io.on('connection', function (socket) {
    socket.on('connect_user', async function (connect_listener) {
      try {
        let check_user = await socketuser.findOne({
          where: {
            user_id: connect_listener.user_id,
          },
        });
        if (check_user) {
          create_socket_user = await socketuser.update(
            {
              is_online: 1,
              socket_id: socket.id,
            },
            {
              where: {
                user_id: connect_listener.user_id,
              },
            }
          );
        } else {
          create_socket_user = await socketuser.create({
            user_id: connect_listener.user_id,
            socket_id: socket.id,
            is_online: 1,
          });
        }
        success_message = [];
        var success_message = {
          success_message: 'connected successfully',
        };
        socket.emit('connect_user', success_message);
      } catch (error) {
        throw error;
      }
    });
    socket.on('disconnect', async data => {
      try {
        let socketId = socket.id;
        await socketuser.update({
          is_online: 0,
          socket_id: socketId,
        });
        const success_message = {
          success_message: 'Disconnect successful',
        };
        socket.emit('disconnect', success_message);
      } catch (error) {
      }
    });
    socket.on('change_driver_status', async function (params) {

      try {

        // 1 => accept
        // 2 => decline
        // 3 => Start
        // 4 => on_Going
        // 5 => Cancel
        // 6 => Completed

        // updatedParms
        // 4 => accept_By_driver
        // 5 => Start_By_driver
        // 6 => on_Going_By_driver
        // 7 => Completed_By_driver
        // 8 => cancel by user no need here because user side have api
        // 9=>pickedup by driver
        // order_id
        // type
        // driver_id
        const find_order = await orders.findOne({
          where: {
            id: params.order_id,
          },
          raw: true,
        });

        if (find_order) {
          await rideRequest.update(
            {
              status: params.type,

            },
            {
              where: {
                driver_id: params.driver_id,
                order_id: params.order_id,
              },
            }
          );
          var findDriver = await users.findOne({
            where: {
              id: params.driver_id,
            },
            raw: true,
          });
          if (params.type == 1) {
            const update_onride = await users.update(
              {
                job_status: 1,
              },
              {
                where: {
                  id: findDriver.id,
                },
              }
            );
          } else if (params.type == 6 || params.type == 5) {
            const update_onride = await users.update(
              {
                job_status: 0,
              },
              {
                where: {
                  id: findDriver.id,
                },
              }
            );
          }


          if (findDriver) {
            // type = 1 // accepted
            if (params.type == 1) {
              const find_order_data = await orders.findOne({
                where: {
                  id: params.order_id,
                },
              });
              if (find_order_data.driver_id != 0) {
                var success_message = {
                  success_message: ' Order Accepted By other Driver',
                };
                socket.emit('change_driver_status', success_message);
                return;
              } else {
                const find_user = await users.findOne({
                  where: {
                    id: find_order_data.user_id,
                  },
                  raw: true,
                });

                const data = await orders.update(
                  {
                    status: 4,
                    driver_id: findDriver.id,
                    reason_id: params.reason ? params.reason : 0,
                  },
                  {
                    where: {
                      id: find_order.id,
                    },
                  }
                );



                const find_driver = await users.findOne({
                  where: {
                    id: findDriver.id,
                  },
                });

                const accept_order = await orders.findOne({
                  include: [
                    {
                      model: users,
                      as: 'orderUser',
                    },
                    {
                      model: users,
                      as: 'orderDriver',
                      attributes: [
                        `id`,
                        `role`,
                        `name`,
                        `email`,
                        `email_verified_at`,
                        `image`,
                        `password`,
                        `country_code`,
                        `phone`,
                        `otp`,
                        `verify_otp`,
                        `latitude`,
                        `longitude`,
                        `country`,
                        `house_number`,
                        `city`,
                        `address`,
                        `postal_code`,
                        `notification_on`,
                        `device_type`,
                        `device_token`,
                        `status`,
                        `verify_driver`,
                        `wallet_amount`,
                        `job_status`,
                        `remember_token`,
                        `created_at`,
                        `updated_at`,
                        `deleted_at`,
                        [
                          sequelize.literal(
                            '(SELECT AVG(rating) FROM driver_ratings WHERE driver_ratings.driver_id = orderDriver.id)'
                          ),
                          'average_rating',
                        ],
                      ],
                    },
                    {
                      model: users,
                      as: 'orderStore',
                      attributes: [
                        `id`,
                        `role`,
                        `name`,
                        `email`,
                        `email_verified_at`,
                        `image`,
                        `password`,
                        `country_code`,
                        `phone`,
                        `otp`,
                        `verify_otp`,
                        `latitude`,
                        `longitude`,
                        `country`,
                        `house_number`,
                        `city`,
                        `address`,
                        `postal_code`,
                        `notification_on`,
                        `device_type`,
                        `device_token`,
                        `status`,
                        `verify_driver`,
                        `wallet_amount`,
                        `job_status`,
                        `remember_token`,
                        `created_at`,
                        `updated_at`,
                        `deleted_at`,
                        [
                          sequelize.literal(
                            '(SELECT AVG(rating) FROM store_ratings WHERE store_ratings.store_id = orderStore.id)'
                          ),
                          'average_rating',
                        ],
                      ],
                    },
                    {
                      model: addresses,
                      as: 'orderAddresses',
                    },
                    {
                      model: order_details,
                      as: 'Order_details',
                      include: {
                        model: products,
                        as: 'orderProduct',
                      },
                    },
                  ],
                  where: {
                    id: find_order.id,
                  },
                });
                accept_order.driver_status = params.type;

                var msg = ` Your order has been accepted By driver ${find_driver.name} `;
                let notificalion_data = {
                  sender_id: accept_order.driver_id,
                  receiver_id: accept_order.user_id,
                  order_id: accept_order.id,
                  type: 1,
                  message: msg,
                };

                let create_accept = await Notifications.create(
                  notificalion_data
                );

                var success_message = {
                  success_message: ' Order Accepted  successfully ',
                  data: accept_order,
                };


              }
            }
            // type = 2 // 1.rejected
            if (params.type == 2) {
              find_order.driver_status = params.type;
              var success_message = {
                success_message: 'Order  Cancel successfully ',
                data: find_order,
              };
            }

            // type = 3 // start trip
            if (params.type == 3) {
              const update_start = await orders.update(
                {
                  status: 5,
                },
                {
                  where: {
                    id: find_order.id,
                  },
                  raw: true,
                }
              );

              const start_order = await orders.findOne({
                include: [
                  {
                    model: users,
                    as: 'orderUser',
                  },
                  {
                    model: users,
                    as: 'orderDriver',
                    attributes: [
                      `id`,
                      `role`,
                      `name`,
                      `email`,
                      `email_verified_at`,
                      `image`,
                      `password`,
                      `country_code`,
                      `phone`,
                      `otp`,
                      `verify_otp`,
                      `latitude`,
                      `longitude`,
                      `country`,
                      `house_number`,
                      `city`,
                      `address`,
                      `postal_code`,
                      `notification_on`,
                      `device_type`,
                      `device_token`,
                      `status`,
                      `verify_driver`,
                      `wallet_amount`,
                      `job_status`,
                      `remember_token`,
                      `created_at`,
                      `updated_at`,
                      `deleted_at`,
                      [
                        sequelize.literal(
                          '(SELECT AVG(rating) FROM driver_ratings WHERE driver_ratings.driver_id = orderDriver.id)'
                        ),
                        'average_rating',
                      ],
                    ],
                  },
                  {
                    model: users,
                    as: 'orderStore',
                    attributes: [
                      `id`,
                      `role`,
                      `name`,
                      `email`,
                      `email_verified_at`,
                      `image`,
                      `password`,
                      `country_code`,
                      `phone`,
                      `otp`,
                      `verify_otp`,
                      `latitude`,
                      `longitude`,
                      `country`,
                      `house_number`,
                      `city`,
                      `address`,
                      `postal_code`,
                      `notification_on`,
                      `device_type`,
                      `device_token`,
                      `status`,
                      `verify_driver`,
                      `wallet_amount`,
                      `job_status`,
                      `remember_token`,
                      `created_at`,
                      `updated_at`,
                      `deleted_at`,
                      [
                        sequelize.literal(
                          '(SELECT AVG(rating) FROM store_ratings WHERE store_ratings.store_id = orderStore.id)'
                        ),
                        'average_rating',
                      ],
                    ],
                  },
                  {
                    model: addresses,
                    as: 'orderAddresses',
                  },
                  {
                    model: order_details,
                    as: 'Order_details',
                    include: {
                      model: products,
                      as: 'orderProduct',
                    },
                  },
                ],
                where: {
                  id: find_order.id,
                },
              });
              start_order.driver_status = params.type;

              var msg = ` Your order has been Start By driver ${start_order.orderDriver.name} `;
              let notificalion_data = {
                sender_id: start_order.driver_id,
                receiver_id: start_order.user_id,
                order_id: start_order.id,
                type: 2,
                message: msg,
              };

              let create_accept = await Notifications.create(
                notificalion_data
              );

              var success_message = {
                success_message: 'Order Start on successfully ',
                data: start_order,
              };
            }
            //type=10 for pickup order
            if (params.type == 10) {
              const update_start = await orders.update(
                {
                  status: 10,
                },
                {
                  where: {
                    id: find_order.id,
                  },
                  raw: true,
                }
              );

              const start_order = await orders.findOne({
                include: [
                  {
                    model: users,
                    as: 'orderUser',
                  },
                  {
                    model: users,
                    as: 'orderDriver',
                    attributes: [
                      `id`,
                      `role`,
                      `name`,
                      `email`,
                      `email_verified_at`,
                      `image`,
                      `password`,
                      `country_code`,
                      `phone`,
                      `otp`,
                      `verify_otp`,
                      `latitude`,
                      `longitude`,
                      `country`,
                      `house_number`,
                      `city`,
                      `address`,
                      `postal_code`,
                      `notification_on`,
                      `device_type`,
                      `device_token`,
                      `status`,
                      `verify_driver`,
                      `wallet_amount`,
                      `job_status`,
                      `remember_token`,
                      `created_at`,
                      `updated_at`,
                      `deleted_at`,
                      [
                        sequelize.literal(
                          '(SELECT AVG(rating) FROM driver_ratings WHERE driver_ratings.driver_id = orderDriver.id)'
                        ),
                        'average_rating',
                      ],
                    ],
                  },
                  {
                    model: users,
                    as: 'orderStore',
                    attributes: [
                      `id`,
                      `role`,
                      `name`,
                      `email`,
                      `email_verified_at`,
                      `image`,
                      `password`,
                      `country_code`,
                      `phone`,
                      `otp`,
                      `verify_otp`,
                      `latitude`,
                      `longitude`,
                      `country`,
                      `house_number`,
                      `city`,
                      `address`,
                      `postal_code`,
                      `notification_on`,
                      `device_type`,
                      `device_token`,
                      `status`,
                      `verify_driver`,
                      `wallet_amount`,
                      `job_status`,
                      `remember_token`,
                      `created_at`,
                      `updated_at`,
                      `deleted_at`,
                      [
                        sequelize.literal(
                          '(SELECT AVG(rating) FROM store_ratings WHERE store_ratings.store_id = orderStore.id)'
                        ),
                        'average_rating',
                      ],
                    ],
                  },
                  {
                    model: addresses,
                    as: 'orderAddresses',
                  },
                  {
                    model: order_details,
                    as: 'Order_details',
                    include: {
                      model: products,
                      as: 'orderProduct',
                    },
                  },
                ],
                where: {
                  id: find_order.id,
                },
              });
              start_order.driver_status = params.type;

              var msg = ` Your order has been Picked Up By driver ${start_order.orderDriver.name} `;
              let notificalion_data = {
                sender_id: start_order.driver_id,
                receiver_id: start_order.user_id,
                order_id: start_order.id,
                type: 7,
                message: msg, 
              };

              let create_accept = await Notifications.create(
                notificalion_data
              );

              var success_message = {
                success_message: 'Order Picked Up successfully ',
                data: start_order,
              };
            }
            // type = 4 // on_Going_By_driver
            if (params.type == 4) {
              const find_user = await users.update(
                {
                  status: 6,
                },
                {
                  where: {
                    id: find_order.id,
                  },
                  raw: true,
                }
              );

              const going_order = await orders.findOne({
                include: [
                  {
                    model: users,
                    as: 'orderUser',
                  },
                  {
                    model: users,
                    as: 'orderDriver',
                    attributes: [
                      `id`,
                      `role`,
                      `name`,
                      `email`,
                      `email_verified_at`,
                      `image`,
                      `password`,
                      `country_code`,
                      `phone`,
                      `otp`,
                      `verify_otp`,
                      `latitude`,
                      `longitude`,
                      `country`,
                      `house_number`,
                      `city`,
                      `address`,
                      `postal_code`,
                      `notification_on`,
                      `device_type`,
                      `device_token`,
                      `status`,
                      `verify_driver`,
                      `wallet_amount`,
                      `job_status`,
                      `remember_token`,
                      `created_at`,
                      `updated_at`,
                      `deleted_at`,
                      [
                        sequelize.literal(
                          '(SELECT AVG(rating) FROM driver_ratings WHERE driver_ratings.driver_id = orderDriver.id)'
                        ),
                        'average_rating',
                      ],
                    ],
                  },
                  {
                    model: users,
                    as: 'orderStore',
                    attributes: [
                      `id`,
                      `role`,
                      `name`,
                      `email`,
                      `email_verified_at`,
                      `image`,
                      `password`,
                      `country_code`,
                      `phone`,
                      `otp`,
                      `verify_otp`,
                      `latitude`,
                      `longitude`,
                      `country`,
                      `house_number`,
                      `city`,
                      `address`,
                      `postal_code`,
                      `notification_on`,
                      `device_type`,
                      `device_token`,
                      `status`,
                      `verify_driver`,
                      `wallet_amount`,
                      `job_status`,
                      `remember_token`,
                      `created_at`,
                      `updated_at`,
                      `deleted_at`,
                      [
                        sequelize.literal(
                          '(SELECT AVG(rating) FROM store_ratings WHERE store_ratings.store_id = orderStore.id)'
                        ),
                        'average_rating',
                      ],
                    ],
                  },
                  {
                    model: addresses,
                    as: 'orderAddresses',
                  },
                  {
                    model: order_details,
                    as: 'Order_details',
                    include: {
                      model: products,
                      as: 'orderProduct',
                    },
                  },
                ],
                where: {
                  id: find_order.id,
                },
                raw: true,
                nest: true,
              });
              going_order.driver_status = params.type;

              var msg = ` Your order has been on Going By driver ${going_order.orderDriver.name} `;
              let notificalion_data = {
                sender_id: going_order.driver_id,
                receiver_id: going_order.user_id,
                order_id: going_order.id,
                type: 3,
                message: msg,
              };

              let create_accept = await Notifications.create(
                notificalion_data
              );
              var success_message = {
                success_message: 'Order  on Going  successfully ',
                data: going_order,
              };
            }
            // type = 5 // cancel_By_driver
            if (params.type == 5) {
              let update_order = await orders.update(
                {
                  driver_id: 0,
                  status: 1,
                  job_status: 0,
                  reason_id: params.reason ? params.reason : 0,
                },
                {
                  where: {
                    id: params.order_id,
                  },
                }
              );
              const cancel_order = await orders.findOne({
                where: {
                  id: find_order.id,
                },
                raw: true,
                nest: true,
              });
              cancel_order.driver_status = params.type;
              var success_message = {
                success_message: ' Cancel Order successfully ',
                data: cancel_order,
              };

              // notificalion Accepted //
              // var msg =
              //     "‘Great news! Your order has been picked up Track Now";
              // let notification = db.notifications.create({
              //     preparationsId: find_order_data.id,
              //     user2Id: find_user.id,
              //     pharmacyId: find_pharmacy.id,
              //     type: 26,
              //     description: msg,
              // });

            }
            // type = 6 // completed
            if (params.type == 6) {

              const delived = await orders.update(
                {
                  status: 7,
                  job_status: 0
                },
                {
                  where: {
                    id: find_order.id,
                  },
                }
              );
              const delivered_order = await orders.findOne({
                include: [
                  {
                    model: users,
                    as: 'orderUser',
                  },
                  {
                    model: users,
                    as: 'orderDriver',
                    attributes: [
                      `id`,
                      `role`,
                      `name`,
                      `email`,
                      `email_verified_at`,
                      `image`,
                      `password`,
                      `country_code`,
                      `phone`,
                      `otp`,
                      `verify_otp`,
                      `latitude`,
                      `longitude`,
                      `country`,
                      `house_number`,
                      `city`,
                      `address`,
                      `postal_code`,
                      `notification_on`,
                      `device_type`,
                      `device_token`,
                      `status`,
                      `verify_driver`,
                      `wallet_amount`,
                      `job_status`,
                      `remember_token`,
                      `created_at`,
                      `updated_at`,
                      `deleted_at`,
                      [
                        sequelize.literal(
                          '(SELECT AVG(rating) FROM driver_ratings WHERE driver_ratings.driver_id = orderDriver.id)'
                        ),
                        'average_rating',
                      ],
                    ],
                  },
                  {
                    model: users,
                    as: 'orderStore',
                    attributes: [
                      `id`,
                      `role`,
                      `name`,
                      `email`,
                      `email_verified_at`,
                      `image`,
                      `password`,
                      `country_code`,
                      `phone`,
                      `otp`,
                      `verify_otp`,
                      `latitude`,
                      `longitude`,
                      `country`,
                      `house_number`,
                      `city`,
                      `address`,
                      `postal_code`,
                      `notification_on`,
                      `device_type`,
                      `device_token`,
                      `status`,
                      `verify_driver`,
                      `wallet_amount`,
                      `job_status`,
                      `remember_token`,
                      `created_at`,
                      `updated_at`,
                      `deleted_at`,
                      [
                        sequelize.literal(
                          '(SELECT AVG(rating) FROM store_ratings WHERE store_ratings.store_id = orderStore.id)'
                        ),
                        'average_rating',
                      ],
                    ],
                  },
                  {
                    model: addresses,
                    as: 'orderAddresses',
                  },
                  {
                    model: order_details,
                    as: 'Order_details',
                    include: {
                      model: products,
                      as: 'orderProduct',
                    },
                  },
                ],
                where: {
                  id: find_order.id,
                },
                raw: true,
                nest: true,
              });
              let find_driver = await db.users.findOne({
                where: {
                  id: findDriver.id,
                },
                raw: true,
              });

              let last_price = +find_driver.wallet_amount;
              let current_price = +delivered_order.driver_fee;
              let Totel_price = last_price + current_price;
              let wallet_price =
                find_driver.driver_fee + delivered_order.driver_fee;
              const update_onride = await users.update(
                {
                  job_status: 0,
                  wallet_amount: Totel_price,
                },
                {
                  where: {
                    id: findDriver.id,
                  },
                }
              );
              delivered_order.driver_status = params.type;
              var msg = ` Your order has been completed By driver ${delivered_order.orderDriver.name} `;
              let notificalion_data = {
                sender_id: delivered_order.driver_id,
                receiver_id: delivered_order.user_id,
                order_id: delivered_order.id,
                type: 4,
                message: msg,
              };
              let create_accept = await Notifications.create(
                notificalion_data
              );
              var success_message = {
                success_message: 'Status changed Deliverd successfully ',
                data: delivered_order,
              };
            }

            let job_status = 1
            if (params.type == 2 || params.type == 5 || params.type == 6) {
              job_status = 0
            }
            await users.update({
              job_status: job_status
            }, {
              where: {
                id: params.driver_id
              }
            });
            socket.emit('change_driver_status', success_message);
            if (params.type != 2) {
              const pushData = await db.orders.findOne({
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
                  id: params.order_id,
                },
                raw: true,
                nest: true,
              });
              pushData.message = msg;
              pushData.role = 2; // 3 for driver 2 for user
              pushData.notification_type = pushData.status;

              await helper.sendPushNotification(pushData);
            }
          } else {
            var success_message = {
              success_message: 'Invalid driver id ',
              data: {},
            };
          }
        } else {
          var success_message = {
            success_message: 'Invalid Order id ',
            data: {},
          };
          socket.emit('change_order_status', success_message);
        }
      } catch (error) {
        console.log(error, '>>>>>>||||||||||||');
        throw error;
      }
    });
    socket.on('loction_update', async function (loction) {
      try {
        const updateloction = await users.update(
          {
            latitude: loction.latitude,
            longitude: loction.longitude,
          },
          {
            where: {
              id: loction.driver_id,
            },
          }
        );

        success_message = [];
        var success_message = {
          success_message: 'Location  update  sucessfully ',
          data: loction,
        };

        socket.emit('loction_update', success_message);

        if (loction.user_id) {
          let Socket_user = await socketuser.findOne({
            where: {
              user_id: loction.user_id,
            },
            raw: true,
          });

          if (Socket_user) {
            success_message = [];
            var success_message = {
              success_message: 'Location  update  sucessfully',
              data: loction,
            };
            io
              .to(Socket_user.socket_id)
              .emit('loction_update', success_message);
          }
        }
      } catch (error) {
        throw error;
      }
    });
  });
};
