const db = require ('../models');
const users = db.users;
const orders = db.orders;
const transection = db.transections;
const paypal = require ('paypal-rest-sdk');
paypal.configure ({
  mode: process.env.MODE, //sandbox
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
});
module.exports = {
  success: async (req, res) => {
    try {
      const paymentId = req.query.paymentId;
      const amount = req.query.amount;
      const orderId = req.query.orderId;
      const PayerID = req.query.PayerID;

      const orderDetails = await orders.findOne({
       where:{
        id: orderId
       },raw:true
      });
      const userDetails = await users.findOne({
      where:{
        id: orderDetails.user_id,
      }
    });
  
      const execute_payment_json = {
        payer_id:PayerID,
        transactions: [
          {
            amount: {
              currency: "USD", //CHF,USD
              total: amount,
            },
          },
        ],
      };
  
      paypal.payment.execute(
        paymentId,
        execute_payment_json,
        async function (error, payment) {
          if (error) {
              return res.render("cancleUrl", {});
          } else {
      
            const payPalTrasectionId = payment.id;
            await orders.update({payment_status:1},{
              where:{
               id: orderId
              },raw:true
             });
            const transectionss = await transection.create({
              order_id: orderId,
              transectionId: payPalTrasectionId,
              payment_status: 1,
            },{raw:true});
            transectionss.dataValues.amount = amount
            const final = transectionss.dataValues
            if (final) {
              return res.render("successUrl", { final });
            }
          }
        }
      );
    } catch (error) {
      return res.render("cancel");

    }
  },
  cancleUrl: async (req, res) => {
    return res.render("cancel");
  },
};
