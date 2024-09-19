const db = require('../models');
const helper = require('../helper/helper');
const { Validator } = require('node-input-validator');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const users = db.users;
const products = db.products;
const orders = db.orders;
const order_details = db.order_details;
const cards = db.cards;
const addresses = db.addresses;
const driver_details = db.driver_details;
const DeliveryFee = db.delivery_fees;
const storeRating = db.store_ratings;
const driverRating = db.driver_ratings;
const rideRequest = db.ride_requests;

module.exports = {
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  //
  //   DRIVER  API IS WORKING NOW   //
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  //
  driverdocument: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        // licence_image_front:'required',
        // licence_image_back: 'required',
        licence_number: 'required|string', // user => 2 //
        issue_date: 'required',
        expiry_date: 'required',
        nationality: 'required|string',
        date_of_birth: 'required',
        // insurance_image_front: 'required',
        // insurance_image_back: 'required',
        // insurance_number: 'required',
        licence_type: 'required',
      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error403(res, errorsResponse);
      }
      var folder = 'drivers';
      var licence_image_front = '';
      if (req.files && req.files.licence_image_front) {
        var licence_image_front_data = await helper.fileUpload(
          req.files.licence_image_front,
          folder
        );
        var licence_image_front = `${req.protocol}://${req.get('host')}/${licence_image_front_data}`;
      }
      var folder = 'drivers';
      var licence_image_back = '';
      if (req.files && req.files.licence_image_back) {
        var image_data = await helper.fileUpload(
          req.files.licence_image_back,
          folder
        );
        var licence_image_back = `${req.protocol}://${req.get('host')}/${image_data}`;
      }
      var folder = 'drivers';
      var insurance_image_front = '';
      if (req.files && req.files.insurance_image_front) {
        var insurance_image_front_data = await helper.fileUpload(
          req.files.insurance_image_front,
          folder
        );
        var insurance_image_front = `${req.protocol}://${req.get('host')}/${insurance_image_front_data}`;
      }
      var folder = 'drivers';
      var insurance_image_back = '';
      if (req.files && req.files.insurance_image_back) {
        var insurance_image_back_data = await helper.fileUpload(
          req.files.insurance_image_back,
          folder
        );
        var insurance_image_back = `${req.protocol}://${req.get('host')}/${insurance_image_back_data}`;
      }

      req.body.licence_image_front = licence_image_front;
      req.body.licence_image_back = licence_image_back;
      req.body.insurance_image_front = insurance_image_front ? insurance_image_front : "";
      req.body.insurance_image_back = insurance_image_back ? insurance_image_back : "";
      req.body.driver_id = req.auth.id;
      const driver_doc = await driver_details.create(req.body);

      const find_driver_doc = await driver_details.findOne({
        where: {
          id: driver_doc.dataValues.id,
        },
        raw: true,
        nest: true,
      });
      return helper.success(
        res,
        ' Driver Document create Succesfully',
        find_driver_doc
      );
    } catch (error) {
      return helper.error403(res, error);
    }
  },
  driverdocument_edit: async (req, res) => {
    try {
      const v = new Validator(
        req.body,
        {
          // licence_image_front:'required',
          // licence_image_back: 'required',
          // licence_number: 'required|string', // user => 2 //
          // issue_date: 'required',
          // expiry_date: 'required',
          // nationality: 'required|string',
          // date_of_birth: 'required',
          // insurance_image_front: 'required',
          // insurance_image_back: 'required',
          // insurance_number: 'required',
          // id:'required',
        }
      );
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error403(res, errorsResponse);
      }
      var folder = 'drivers';
      if (req.files && req.files.licence_image_front) {
        var licence_image_front_data = await helper.fileUpload(
          req.files.licence_image_front,
          folder
        );
        var licence_image_front = `${req.protocol}://${req.get('host')}/${licence_image_front_data}`;
      }
      if (req.files && req.files.licence_image_back) {
        var image_data = await helper.fileUpload(
          req.files.licence_image_back,
          folder
        );
        var licence_image_back = `${req.protocol}://${req.get('host')}/${image_data}`;
      }

      if (req.files && req.files.insurance_image_front) {
        var insurance_image_front_data = await helper.fileUpload(
          req.files.insurance_image_front,
          folder
        );
        var insurance_image_front = `${req.protocol}://${req.get('host')}/${insurance_image_front_data}`;
      }

      if (req.files && req.files.insurance_image_back) {
        var insurance_image_back_data = await helper.fileUpload(
          req.files.insurance_image_back,
          folder
        );
        var insurance_image_back = `${req.protocol}://${req.get('host')}/${insurance_image_back_data}`;
      }

      req.body.licence_image_front = licence_image_front;
      req.body.licence_image_back = licence_image_back;
      req.body.insurance_image_front = insurance_image_front;
      req.body.insurance_image_back = insurance_image_back;

      const driver_doc = await driver_details.update(req.body, {
        where: {
          driver_id: req.auth.id,
        },
      });

      const find_driver_doc = await driver_details.findOne({
        where: {
          driver_id: req.auth.id,
        },
        raw: true,
        nest: true,
      });

      return helper.success(
        res,
        ' Driver Document update Succesfully',
        find_driver_doc
      );
    } catch (error) {
      return helper.error403(res, error);
    }
  },
  deliveryfees: async (req, res) => {
    try {
      let deliveryfees = await DeliveryFee.findAll();

      return helper.success(
        res,
        ' Find  delivery fees   Succesfully ',
        deliveryfees
      );
    } catch (error) {
      return helper.error403(res, error);
    }
  },
  jobhistory: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        type: 'required',
      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error403(res, errorsResponse);
      }
      if (req.body.type == 1) {
        where = {
          [Op.or]: [
            { status: 0 },
            { status: 1 },
            { status: 2 },
            { status: 3 },
            { status: 4 },
            { status: 5 },
            { status: 6 },
          ],

          driver_id: req.auth.id,
        };
      } else {
        where = {
          driver_id: req.auth.id,
          status: 7,
        };
      }

      let findJob = await orders.findAll({
        attributes: [
          `id`,
          `unique_id`,
          `user_id`,
          `driver_id`,
          `address_id`,
          `payment_mode`,
          `delivery_time`,
          `instructions`,
          `card_id`,
          `driver_fee`,
          `sub_total`,
          `service_fee`,
          `total`,
          `status`,
          `store_id`,
          `order_date`,
          `created_at`,
          `updated_at`,
          `deleted_at`,
          [
            sequelize.literal(
              '(SELECT rating FROM driver_ratings WHERE driver_ratings.order_id = id)'
            ),
            'driver_ratings',
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
            model: cards,
            as: 'orderCards',
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
      return helper.success(res, 'Find order Succesfully', findJob);
    } catch (error) {
      return helper.error403(res, error);
    }
  },
  allrating: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        order_id: 'required',
        driver_id: 'required',
        store_id: 'required',
        // storeRating: "required",
        // storeReview: "required",
        // driverRating: "required",
        // driverReview: "required",
      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error403(res, errorsResponse);
      }
      let create_rating = await storeRating.create({
        user_id: req.auth.id,
        store_id: req.body.store_id,
        order_id: req.body.order_id,
        rating: req.body.storeRating,
        comment: req.body.storeReview,
      });
      let rating_create = await driverRating.create({
        user_id: req.auth.id,
        driver_id: req.body.driver_id,
        order_id: req.body.order_id,
        rating: req.body.driverRating,
        comment: req.body.driverReview,
      });
      return helper.success(res, 'Rating added Succesfully');
    } catch (error) {
      return helper.error403(res, error);
    }
  },
  driveravailability: async function (req, res) {
    try {
      const v = new Validator(req.body, {
        availability: 'required|integer',
      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error403(res, errorsResponse);
      }
      let data_updated = await users.update(
        {
          availability: req.body.availability,
        },
        {
          where: {
            id: req.auth.id,
          },
        }
      );

      let find_respones = await users.findOne({
        where: {
          id: req.auth.id,
        },
        raw: true,
        nest: true,
      });

      return helper.success(
        res,
        'Availability changed successfully',
        find_respones
      );
    } catch (error) {
      return helper.error403(res, error);
    }
  },
  driver_request: async (req, res) => {
    try {
      let find_order = await orders.findAll({
        include: [
          {
            model: users,
            as: 'orderstore',
            attributes: [`id`, `name`, `latitude`, `longitude`],
          },
        ],
        where: {
          status: 1,
        },
        raw: true,
        nest: true,
      });

      await Promise.all(
        find_order.map(async e => {
          const rides = await rideRequest.findAll({
            where: {
              order_id: e.id,
              [Op.or]: [{ assign: 0 }, { reject: 1 }],
            },
            attributes: ['driver_id'],
            raw: true,
          });

          let reject_ids = [];
          await Promise.all(
            rides.map(async ids => {
              reject_ids.push(ids.driver_id);
            })
          );
          let find_driver = await user.findOne({
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
                  `6371 * acos(cos(radians(${e.orderstore.latitude})) * cos(radians(users.latitude)) * cos(radians(${e.orderstore.longitude}) - radians(users.longitude)) + sin(radians(${e.orderstore.latitude})) * sin(radians(users.latitude)))`
                ),
                'distance',
              ],
            ],
            where: {
              role: 3,
              id: {
                [Op.not]: reject_ids,
              },
            },
            having: {
              distance: {
                [Op.lt]: 10,
              },
            },
            order: [[sequelize.literal('distance'), 'ASC']],
            raw: true,
            nest: true,
          });

          if (find_driver) {
            let ridercreate = await rideRequest.create({
              order_id: e.id,
              driver_id: find_driver.id,
              assign: 0,
              reject: 0,
            });
          }
        })
      );

      return helper.success(res, ' Send order to driver  Succesfully');
    } catch (error) {
      return helper.error403(res, error);
    }
  },
  driverhome: async (req, res) => {
    try {
      const currentTimestamp = Date.now();
      const thirtySecondsAgo = new Date(currentTimestamp - 30 * 1000);
      var date = new Date(thirtySecondsAgo);
      var year = date.getFullYear();
      var month = ('0' + (date.getMonth() + 1)).slice(-2);
      var day = ('0' + date.getDate()).slice(-2);
      var hours = ('0' + date.getHours()).slice(-2);
      var minutes = ('0' + date.getMinutes()).slice(-2);
      var seconds = ('0' + date.getSeconds()).slice(-2);
      var convertedTimestamp =
        year +
        '-' +
        month +
        '-' +
        day +
        ' ' +
        hours +
        ':' +
        minutes +
        ':' +
        seconds;

      let assin_request = await rideRequest.findOne({
        where: {
          driver_id: req.auth.id,
          status:  [0,1,3,4]
          },
        order: [['id', 'DESC']],
      });
      if (assin_request) {
        let find_order = await db.orders.findOne({
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
            id: assin_request.order_id
          },
        });
        find_order.dataValues.driver_status = assin_request.status;
        let currentTimestamp = Math.floor(Date.now() / 1000);
        let order_time = assin_request.createdAt;
        let currentTimestamps = Math.floor(order_time / 1000);
        find_order.dataValues.pendingSeconds =
          30 - (currentTimestamp - currentTimestamps);

        return helper.success(res, 'get data Succesfully', find_order);
      } else {
        return helper.success(res, 'get data Succesfully', {});
      }
    } catch (error) {
      return helper.error403(res, error);
    }
  },

  getdriverrating: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        driver_id: "required",
      });

      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error403(res, errorsResponse);
      }

      const find_driver_ratings = await driverRating.findAll({
        where: {
          driver_id: req.body.driver_id, // Use driver_id for the query
        },
      });

      if (!find_driver_ratings || find_driver_ratings.length === 0) {
        return helper.error403(res, 'Driver ratings not found for the specified driver_id');
      }

      return helper.success(
        res,
        'Driver Reviews & Ratings fetched successfully',
        find_driver_ratings
      );
    } catch (error) {
      return helper.error403(res, error);
    }
  },
};
