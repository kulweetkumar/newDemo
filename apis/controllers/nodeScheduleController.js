const db = require("../models");
const helper = require("../helper/helper");
const schedule = require("node-schedule");
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
const notifications = db.notifications;
const withdraws = db.withdraws;
const envfile = process.env;
const stripe = require('stripe')(envfile.PAYMENTMODE == 1 ? envfile.SECRETKEYLIVE : envfile.SECRETKEYTEST);
module.exports = {
    orderlist: io => async (req, res) => {
        // schedule.scheduleJob("*/2 * * * * *", async () => {
        let orderData = await orders.count({
            where: {
                status: 1,
            },
        });
        if (orderData > 0) {
            let find_order = await orders.findAll({
                where: {
                    status: 1,
                },
                include: [
                    {
                        model: users,
                        as: "orderUser",
                    },
                    {
                        model: users,
                        as: "orderDriver",
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
                            `wallet_amount`,
                            `job_status`,
                            `remember_token`,
                            `created_at`,
                            `updated_at`,
                            `deleted_at`,
                            [
                                sequelize.literal(
                                    "(SELECT AVG(rating) FROM driver_ratings WHERE driver_ratings.driver_id = orderDriver.id)"
                                ),
                                "average_rating",
                            ],
                        ],
                    },

                    {
                        model: cards,
                        as: "orderCards",
                    },
                    {
                        model: users,
                        as: "orderStore",
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
                            `wallet_amount`,
                            `job_status`,
                            `remember_token`,
                            `created_at`,
                            `updated_at`,
                            `deleted_at`,
                            [
                                sequelize.literal(
                                    "(SELECT AVG(rating) FROM store_ratings WHERE store_ratings.store_id = orderStore.id)"
                                ),
                                "average_rating",
                            ],
                        ],
                    },
                    {
                        model: addresses,
                        as: "orderAddresses",
                    },
                    {
                        model: order_details,
                        as: "Order_details",
                        include: {
                            model: products,
                            as: "orderProduct",
                        },
                    },
                ],
                // orderby: [['id', 'desc']]
            });

            for (let order of find_order) {
                let e = order.toJSON();
                const timestamp = Math.floor(Date.now() / 1000);
                console.log(timestamp,'timeDifferenceInSeconds');
                const threeHoursInSeconds = 4 * 60 * 60;
                const uniqueIdTimestamp = e.unique_id;
                console.log(uniqueIdTimestamp,'timeDifferenceInSeconds');

                const timeDifferenceInSeconds = timestamp - threeHoursInSeconds;
                // const fiveMinutesInSeconds = 5 * 60;
                // const uniqueIdTimestamp = e.unique_id;
                // const timeDifferenceInSeconds = timestamp - fiveMinutesInSeconds;
              
                if (uniqueIdTimestamp > timeDifferenceInSeconds) {
                    const rides = await rideRequest.findAll({
                        where: {
                            order_id: e.id,
                            [Op.or]: [{ assign: 0 }, { reject: 1 }],
                        },
                        attributes: ["driver_id"],
                        raw: true,
                    });
                    let reject_ids = [];
                    await Promise.all(
                        rides.map(async (ids) => {
                            reject_ids.push(ids.driver_id);
                        })
                    );
                    const rideTime = await rideRequest.findOne({
                        where: {
                            order_id: e.id,
                            status: [1, 0, 5]
                        }, raw: true,
                        order: [['createdAt', 'DESC']]
                    })
                    const currentTime = new Date();
                    const createdAt = new Date(rideTime && rideTime.createdAt);
                    const timeDifferenceInSeconds = Math.abs(currentTime - createdAt) / 1000;
                    if (timeDifferenceInSeconds >= 30) {
                        const dataRide = await rideRequest.findAll({
                            attributes: ["driver_id"],
                            where: {
                                status: [0, 1, 3, 4, 7],
                            }, raw: true
                        });
                        await Promise.all(
                            dataRide.map(async (ids) => {
                                reject_ids.push(ids.driver_id);
                            })
                        );
                        const reject_id = [...new Set(reject_ids)];
                        let find_driver = await users.findOne({
                            attributes: [`id`, `role`, `name`, `device_type`, `device_token`,
                                [
                                    sequelize.literal(
                                        `6371 * acos(cos(radians(${e.orderStore.latitude})) * cos(radians(users.latitude)) * cos(radians(${e.orderStore.longitude}) - radians(users.longitude)) + sin(radians(${e.orderStore.latitude})) * sin(radians(users.latitude)))`
                                    ),
                                    "distance",
                                ],
                            ],
                            where: {
                                role: 3,
                                job_status: 0,
                                verify_driver: 1,
                                availability: 1,
                                id: {
                                    [Op.not]: reject_ids,
                                },
                            },
                            having: {
                                distance: {
                                    [Op.lt]: 30,
                                },
                            },
                            order: sequelize.literal('distance ASC'),
                            raw: true,
                        });
                        if (find_driver) {
                            await rideRequest.create({
                                order_id: e.id,
                                driver_id: find_driver.id,
                                reason: 0,
                                assign: 0,
                                reject: 0,
                            });
                            let find_shocketId = await socketuser.findOne({
                                where: {
                                    user_id: find_driver.id,
                                },
                                raw: true
                            });
                            const pushData = await db.orders.findOne({
                                include: [
                                    {
                                        model: users,
                                        as: 'orderUser',
                                        attributes: [`id`, `role`, `name`, `device_type`, `device_token`],
                                    },
                                ],
                                where: {
                                    id: e.id,
                                },
                            });
                            const msg = `You have assign a new order`;
                            pushData.message = msg;
                            pushData.role = 3; // 3 for driver 2 for user
                            pushData.notification_type = pushData.status;
                            pushData.orderDriver = find_driver;
                            // e.distance = find_driver.distance
                            await helper.sendPushNotification(pushData);
                            io.to(find_shocketId && find_shocketId.socket_id).emit("driverrequest", e);
                            return res.json(200, find_driver, {})
                        }
                    }
                } else {
                    let neewe = await orders.update(
                        { status: 10 },
                        { where: { id: e.id } }
                    );
                    continue;

                }

            }
        }
        return res.json(200, "data", {})
        // });
    },
    stripe_amount: async (req, res) => {
        let withdrawsData = await withdraws.findAll({
            where: {
                status: 0,
                payment_transfer: 0,
            },
            raw: true,
        });

        if (withdrawsData.length > 0) {
            const balance = await stripe.balance.retrieve();
            if (balance.available[0].amount >= 10) {

                for (let i in withdrawsData) {
                    let userData = await users.findOne({
                        where: {
                            id: withdrawsData[i].user_id,
                        }, raw: true
                    });
                    if (userData.hasAccountId == 1) {
                        try {
                            const transfer = await stripe.transfers.create({
                                amount: withdrawsData[i].price * 100,
                                currency: 'usd',
                                destination: userData.stripeAccountId,
                                transfer_group: "New Demo payment",
                            });

                            if (transfer) {
                                await withdraws.update({
                                    payment_transfer: 1
                                }, {
                                    where: {
                                        id: withdrawsData[i].id,
                                    }
                                });
                                var msg =
                                    "Your payment transfer successfully";
                                let notification = notifications.create({
                                    sender_id: 1,
                                    receiver_id: withdrawsData[i].user_id,
                                    status: 1,
                                    type: 11,
                                    message: msg,
                                    is_read: 0
                                });
                            }

                        } catch (error) {
                            console.log(error);
                            throw error;
                        }
                    }
                }
                return res.json(200, "data", {})
            }
        }
        return res.json(200, "data", {})
    }
};

