const db = require('../models');
const helper = require('../helper/helper');
const moment = require('moment');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const { Validator } = require('node-input-validator');
const { paymentConst } = require('../config/config');
const store_details = db.store_details;
const users = db.users;
const products = db.products;
const categories = db.categories;
const banner_details = db.banner_details;
const orders = db.orders;
const order_details = db.order_details;
const cards = db.cards;
const addresses = db.addresses;
const deliveryFees = db.delivery_fees
const envfile = process.env;
users.hasOne(store_details, {
  foreignKey: 'store_id',
  as: 'store_details',
});
banner_details.belongsTo(users, {
  foreignKey: 'store_id',
  as: 'banner_store',
});
products.belongsTo(categories, {
  foreignKey: 'category_id',
  as: 'category',
});
products.belongsTo(users, {
  foreignKey: 'store_id',
  as: 'store',
});
users.hasMany(products, {
  foreignKey: 'store_id',
  as: 'products',
});
orders.hasMany(order_details, {
  foreignKey: 'order_id',
  as: 'Order_details',
});

orders.belongsTo(users, {
  foreignKey: 'user_id',
  as: 'orderUser',
});
orders.belongsTo(users, {
  foreignKey: 'driver_id',
  as: 'orderDriver',
});
orders.belongsTo(cards, {
  foreignKey: 'card_id',
  as: 'orderCards',
});
orders.belongsTo(users, {
  foreignKey: 'store_id',
  as: 'orderStore',
});
orders.belongsTo(addresses, {
  foreignKey: 'address_id',
  as: 'orderAddresses',
});

order_details.belongsTo(products, {
  foreignKey: 'product_id',
  as: 'orderProduct',
});

module.exports = {
  order: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        address_id: 'required',
        payment_mode: 'required',
        card_id: 'required',
        driver_fee: 'required',
        sub_total: 'required',
        service_fee: 'required',
        total: 'required',
        store_id: 'required',
      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error403(res, errorsResponse);
      }
      const timestamp = Math.floor(Date.now() / 1000);
      const dateObject = new Date();
      let order_date = moment(dateObject, 'MM-DD-YYYY HH:mm:ss', true).format(
        'MM-DD-YYYY'
      );
      req.body.unique_id = timestamp;
      req.body.user_id = req.auth.id;
      req.body.order_date = order_date;

      let create_order = await orders.create(req.body);

      var find_order = await orders.findOne({
        where: {
          id: create_order.id,
        },
        raw: true,
      });

      let product_id = JSON.parse(req.body.product_id);

      await Promise.all(
        product_id.map(async e => {

          const productDetail = await db.products.findOne({
            where: {
              id: e.product_id,
            },
            raw: true,
          });
          await db.products.update({ stock: productDetail.stock - e.quantity }, {
            where: {
              id: e.product_id,
            },
            raw: true,
          });
          let product_price = +productDetail.price;
          let quantity_number = e.quantity;
          let quantity_price = product_price * quantity_number;

          let data = {
            order_id: find_order.id,
            store_id: req.body.store_id,
            product_id: e.product_id,
            quantity: e.quantity,
            product_name: productDetail.name,
            product_image: productDetail.image,
            product_description: productDetail.description,
            price: quantity_price,
          };
          let order_detais = await order_details.create(data);
        })
      );
      if (req.body.payment_mode == 1) { // payment with stripe 
        const status = 0;
        await orders.update({ payment_status: status, status: 0 }, {
          where: {
            id: find_order.id
          }
        });
      } else if (req.body.payment_mode == 2) { // cash on delivery
        await orders.update({ payment_status: 2, status: 0 }, {
          where: {
            id: find_order.id
          }
        });
        // var paypalPayment = await helper.paypalPayment(find_order, req, item);
      }

      let msg = ` your order has been  Submitted `;

      // find_order.payment_url = paypalPayment ? paypalPayment : ""
      return helper.success(res, ' Create Order Successfully ', find_order);
    } catch (error) {
      console.log(error)
      return helper.error403(res, error);
    }
  },
  orderhistory: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        type: 'required',
      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error403(res, errorsResponse);
      }
      if (req.body.type == 1) {
        const today = new Date();
        where = {
          status: [0, 1, 4, 5, 6],
          user_id: req.auth.id,
        };
      } else if (req.body.type == 2) {
        where = {
          status: [3, 7, 8, 9],
          user_id: req.auth.id,
        };

      } else {
        where = {
          user_id: req.auth.id,
        };
      }
      const find_order = await orders.findAll({
        attributes: [
          `id`,
          `unique_id`,
          `user_id`,
          `driver_id`,
          `address_id`,
          `payment_mode`,
          `card_id`,
          `driver_fee`,
          `sub_total`,
          `service_fee`,
          `total`,
          `status`,
          `store_id`,
          `payment_status`,
          `order_date`,
          `delivery_time`,
          `instructions`,
          `created_at`,
          `updated_at`,
          `deleted_at`,
          `tip`,
          [
            sequelize.literal(
              '(SELECT rating FROM driver_ratings WHERE driver_ratings.order_id = id)'
            ),
            'driver_ratings',
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM store_ratings WHERE store_ratings.order_id = id)'
            ),
            'order_ratings_count',
          ],
        ],
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
            model: cards,
            as: 'orderCards',
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
        where: where,
      });

      return helper.success(res, 'Find order history Succesfully', find_order);
    } catch (error) {
      return helper.error403(res, error);
    }
  },
  orderdetails: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        id: 'required',
      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error403(res, errorsResponse);
      }
      const find_order = await orders.findOne({
        attributes: [
          `id`,
          `unique_id`,
          `user_id`,
          `driver_id`,
          `address_id`,
          `payment_mode`,
          `card_id`,
          `delivery_time`,
          `instructions`,
          `driver_fee`,
          `sub_total`,
          `service_fee`,
          `total`,
          `status`,
          `store_id`,
          `payment_status`,
          `order_date`,
          `created_at`,
          `updated_at`,
          `deleted_at`,
          `tip`,
          [
            sequelize.literal(
              '(SELECT rating FROM driver_ratings WHERE driver_ratings.order_id = id)'
            ),
            'driver_ratings',
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM store_ratings WHERE store_ratings.order_id = id)'
            ),
            'order_ratings_count',
          ],
        ],
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
            model: cards,
            as: 'orderCards',
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
          id: req.body.id,
        },
      });

      return helper.success(res, 'Find order Succesfully', find_order);
    } catch (error) {
      return helper.error403(res, error);
    }
  },
  orderPayment: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        id: 'required',
      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error403(res, errorsResponse);
      }
      const find_order = await orders.findOne({
        include: [
          {
            model: users,
            as: 'orderUser',
          },
        ],
        where: {
          id: req.body.id,
        }
      });
      if (find_order && find_order.dataValues) {
        let payment = await helper.stripePayment(find_order.dataValues);
        var vendor_get = await orders.update({
          transaction_id: payment.paymentIntent.id,
          payment_status: 0,
        },
          {
            where: {
              id: req.body.id,
            },
          });
        let paymentResponse = {
          paymentIntent: payment.paymentIntent.client_secret,
          ephemeralKey: payment.ephemeralKey.secret,
          customer: payment.stripe_id,
          publishableKey: paymentConst.PAYMENTMODE == 1 ? envfile.PUBLISHABLEKEYLIVE : envfile.PUBLISHABLEKEYTEST
        };
        return helper.success(res, 'Order place Succesfully. Please wait for confirm', paymentResponse);
      } else {
        return helper.error403(res, "order not found ");
      }
    } catch (error) {
      return helper.error403(res, error);
    }
  },

  stripeWebhook: async (req, res) => {
    try {
      var orderUpdatestatus = await orders.update({
        payment_status: req.body.data.object.status == "succeeded" ? 1 : 0
      },
        {
          where: {
            transactionNo: req.body.data.object.id,
          },
        });
      return orderUpdatestatus
    } catch (error) {
      return helper.error403(res, error);
    }
  },
  deliveryFees: async (req, res) => {
    try {
      const v = new Validator(req.query, {
        distance: "required"

      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error403(res, errorsResponse);
      }
      // const distanceInKm = parseFloat(req.query.distance) * 1.60934;
      // const deliveryfee = await deliveryFees.findOne({
      //   where: {
      //     distance_from: {
      //       [Op.lte]: distanceInKm
      //     },
      //     distance_to: {
      //       [Op.gte]: distanceInKm
      //     }
      //   },
      //   order: [
      //     ['id', 'DESC']
      //   ]
      // });
      const basicFee = await deliveryFees.findOne({
        where: {
          id: 1
        },
        deleted_at: null,
        raw: true
      });
      const permilesfee = await deliveryFees.findOne({
        where: {
          id: 2
        },
        deleted_at: null,
        raw: true
      });
      const price = parseFloat(basicFee.price);
      const basemiles = parseFloat(basicFee.distance_to)
      const distanceInKm = parseFloat(req.query.distance);
      const distanceInMiles = distanceInKm * 0.621371;
      if (distanceInMiles > basemiles) {
        const cal_miles = parseFloat(distanceInMiles) - basemiles;
        const permileprice = parseFloat(permilesfee.price);
        const permile = parseFloat(permilesfee.distance_to);
        const totalmiles = parseFloat(cal_miles) / permile;

        const miles_price = parseFloat(totalmiles) * permileprice;
        var deliveryfee = (miles_price + price).toFixed(2);
      } else {
        var deliveryfee = (price).toFixed(2);
      }
      if (deliveryfee) {
        data = {
          price: deliveryfee
        }
        return helper.success(res, 'Price Get successfully', data);
      } else {
        return helper.error403(res, 'Delivery not avilable', {});
      }

    } catch (error) {
      console.log(error, 'eroor')
      return helper.error403(res, error);
    }

  },
  updateOrderStatus: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        order_id: "required",
        status: "required",
      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error403(res, errorsResponse);
      }

      var ride = await orders.update({ payment_status: req.body.status, status: 0 }, {
        where: {
          id: req.body.order_id
        }
      });

      if (ride) {
        let msg = ` Ride created successfully.`;
        return helper.success(res, msg, {});
      } else {
        let msg = ` Ride created successfully.`;
        return helper.error403(res, msg, {});
      }
    } catch (error) {
      return helper.error403(res, error);
    }
  }
};
