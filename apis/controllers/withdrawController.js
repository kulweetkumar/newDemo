const db = require('../models');
const helper = require('../helper/helper');
const { Validator } = require('node-input-validator');
const sequelize = require('sequelize');
const { paymentConst } = require('../config/config');
const Withdraw = db.withdraws;
const Op = sequelize.Op;
const envfile = process.env;

const stripe = require('stripe')(paymentConst.PAYMENTMODE == 1 ? envfile.SECRETKEYLIVE : envfile.SECRETKEYTEST);
const users = db.users;
Withdraw.belongsTo(users, {
  foreignKey: 'user_id',
});
module.exports = {
  withdraw: async function (req, res) {
    try {
      const v = new Validator(req.body, {
        price: 'required',
      });
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.error403(res, errorsResponse);
      }
      req.body.user_id = req.auth.id;
      let userData = await users.findOne({
        where: {
          id: req.auth.id,
        }, raw: true
      });

      // let account = await stripe.accounts.retrieve(
      //   userData?.stripeAccountId
      // );
      if (userData?.stripeAccountId != "") {
        let stripeReturnUrl = 'https://app.azonwheels.com/api/stripe_connect'
        var accountLink = await helper.create_stripe_connect_url(
          userData,
          stripeReturnUrl + `?state=${userData.id}`
        );
        let url = accountLink ? accountLink.url : ""
        return helper.success(res, 'Please add bank account first', { url: url });
      } else {
        req.body.bankid = 0;
        if (Number(req.body.price) > Number(userData.wallet_amount)) {
          return helper.error403(res, 'you do not have enough balance to widthraw');

        }

        const Withdraw_request = await Withdraw.create(req.body);

        const amount = userData.wallet_amount - req.body.price;

        await users.update(
          {
            wallet_amount: amount,

          },
          {
            where: {
              id: req.auth.id,
            },
          }
        );
        const Withdraw_get = await Withdraw.findOne({
          where: {
            id: Withdraw_request.id,
          },
          raw: true,
        });

        return helper.success(res, 'Withdraw Add Succesfully', Withdraw_get);
      }
    } catch (error) {

      helper.error403(res, error);
    }
  },
  withdrawList: async function (req, res) {
    try {
      const currentDate = new Date(); // Get the current date
      let startDate, endDate;

      const DaystartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        0,
        0,
        0
      );
      const DayendDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        23,
        59,
        59
      );
      const currentDay = currentDate.getDay();
      const startOfWeek = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - currentDay,
        0,
        0,
        0
      );
      const weekstartDate = startOfWeek;
      const weekendDate = new Date(
        startOfWeek.getFullYear(),
        startOfWeek.getMonth(),
        startOfWeek.getDate() + 6,
        23,
        59,
        59
      );
      const monthstartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
        0,
        0,
        0
      );
      const monthendDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
        23,
        59,
        59
      );
      const AllstartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        0,
        0,
        0
      );
      const AllendDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        23,
        59,
        59
      );

      const Day = await Withdraw.findAll({
        include: [
          {
            model: users,
            attributes: ['name', 'image'],
          },
        ],
        where: {
          user_id: req.auth.id,
          created_at: {
            [Op.between]: [DaystartDate, DayendDate],
          },
        },
      });
      const week = await Withdraw.findAll({
        include: [
          {
            model: users,
            attributes: ['name', 'image'],
          },
        ],
        where: {
          user_id: req.auth.id,
          created_at: {
            [Op.between]: [weekstartDate, weekendDate],
          },
        },
      });
      const month = await Withdraw.findAll({
        include: [
          {
            model: users,
            attributes: ['name', 'image'],
          },
        ],
        where: {
          user_id: req.auth.id,
          created_at: {
            [Op.between]: [monthstartDate, monthendDate],
          },
        },
      });
      const All = await Withdraw.findAll({
        include: [
          {
            model: users,
            attributes: ['name', 'image'],
          },
        ],
        where: {
          user_id: req.auth.id,
          created_at: {
            [Op.between]: [AllstartDate, AllendDate],
          },
        },
      });
      var walletAmount = parseFloat(req.auth.wallet_amount);

      walletAmount = isNaN(walletAmount) ? 0 : walletAmount; // Set to 0 if NaN
      walletAmount = walletAmount.toFixed(2);

      obj = {
        day: Day,
        week: week,
        month: month,
        all: All,
        walletamount: walletAmount,
      };

      return helper.success(res, 'Withdraw list', obj);
    } catch (error) {
      helper.error403(res, error);
    }
  },
  // checkAccount: async function (req, res) {
  //   try {

  //     req.body.user_id = req.auth.id;
  //     let userData = await users.findOne({
  //       where: {
  //         id: req.auth.id,
  //       }, raw: true
  //     });
  //     if (userData.stripeAccountId != "") {
  //       const responseData = await stripe.accounts.retrieve(
  //         userData.stripeAccountId
  //       );
  //       if (responseData?.charges_enabled == false) {
  //         hasAccountId = 0;
  //       } else {
  //         hasAccountId = 1;
  //       }
  //       await users.update(
  //         {
  //           stripeAccountId: responseData?.id,
  //           hasAccountId: hasAccountId,
  //         },
  //         {
  //           where: {
  //             id: req.auth.id,
  //           },
  //         }
  //       );
  //       return helper.success(res, 'Account added successfully', { status: 1 });
  //     }
  //     return helper.success(res, 'Some thing went worng', { status: 0 });
  //     // if (responseData?.charges_enabled == true) {
  //     // } else {
  //     // }

  //   } catch (error) {
  //     await helper.error403(res, error);
  //   }
  // },
  checkAccount: async function (req, res) {
    try {

      req.body.user_id = req.auth.id;
      let userData = await users.findOne({
        where: {
          id: req.auth.id,
        }, raw: true
      });
      const responseData = await stripe.accounts.retrieve(
        userData.stripeAccountId
      );
      if (responseData?.charges_enabled == false) {
        hasAccountId = 0;
      } else {
        hasAccountId = 1;
      }
      await users.update(
        {
          stripeAccountId: responseData?.id,
          hasAccountId: hasAccountId,
        },
        {
          where: {
            id: req.auth.id,
          },
        }
      );
      const update_user = await users.findOne({
        where: {
          id: req.auth.id,
        },
        raw: true,
      });
      if (responseData?.charges_enabled == true) {
        return helper.success(res, 'Account added successfully', { status: 1 });
      } else {
        return helper.success(res, 'Some thing went worng', { status: 0 });
      }

    } catch (error) {
      await helper.error403(res, error);
    }
  },
  drumi: async function (req, res) {
    let data = req.body;
    console.log(data, 'dataaaaaaa');
    return helper.success(res, 'Account added successfully', data);
  }
};
