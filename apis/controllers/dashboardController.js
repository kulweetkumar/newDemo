const db = require("../models");
const helper = require("../helper/helper");
const { Validator } = require("node-input-validator");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const store_details = db.store_details;
const users = db.users;
const products = db.products;
const categories = db.categories;
const banner_details = db.banner_details;
const subcategories = db.subcategories;
const storeRating = db.store_ratings;
const reasons = db.reasons
products.belongsTo(subcategories, {
    foreignKey: 'subcategory_id',
    as: 'subcategory',
});
subcategories.hasMany(products, { foreignKey: 'subcategory_id', as: 'products' });
const restaurant_cuisines = db.restaurant_cuisines;
restaurant_cuisines.belongsTo(users, {
    foreignKey: 'restaurant_id',
    as: 'restaurant',
});
products.belongsTo(users, {
    foreignKey: 'store_id',
    as: 'storeinfo',
});
module.exports = {
    home: async (req, res) => {
        try {
            if (req.headers.authorization) {
                await helper.verifyUser(req, res, 1);
            }
            const v = new Validator(req.body, {
                latitude: "required",
                longitude: "required",
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }
            const storeId = await helper.getStoreId(req, res);
            let condition = {
                id: storeId,
                status: 1,
                role: [1, 4],
                deletedAt: null,
            }
            // if (req.body.keyword) {
            //     condition = {
            //         [Op.or]: [
            //             {
            //                 name: {
            //                     [Op.like]: `%${req.body.keyword}%`,
            //                 },
            //             },
            //         ]
            //     }
            // }

            let find_store = await users.findAll({
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
                            `6371 * acos(cos(radians(${req.body.latitude})) * cos(radians(users.latitude)) * cos(radians(${req.body.longitude}) - radians(users.longitude)) + sin(radians(${req.body.latitude})) * sin(radians(users.latitude)))`
                        ),
                        "distance",
                    ],
                    [
                        sequelize.literal(
                            " IFNULL((SELECT AVG(rating) FROM store_ratings WHERE store_ratings.store_id = users.id),0)"
                        ),
                        "average_rating",
                    ],
                ],
                include: [
                    {
                        model: store_details,
                        as: "store_details",
                    },
                ],
                where: condition,
                having: {
                    distance: {
                        [Op.lte]: 30,
                    },
                },
            });

            let get_id = [];
            find_store.map((item) => {
                get_id.push(item.id);
            });

            let find_categories = await categories.findAll();

            let find_banner_details = await banner_details.findAll({
                include: [
                    {
                        model: users,
                        as: "banner_store",
                    },
                ],
                where: {
                    store_id: get_id,
                },
            });
            let pro = await products.findAll({
                include: [
                    {
                        attributes:['name'],
                        model: users,
                        as: "storeinfo",
                    },
                ],
                where: {
                    store_id: get_id,
                },

                limit:10
            });
            let data = {
                nearby: find_store,
                categories: find_categories,
                banners: find_banner_details,
                products:pro
            };

            return helper.success(res, " Home data find  Succesfully ", data);
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    categories_store: async (req, res) => {
        try {
            if (req.headers.authorization) {
                await helper.verifyUser(req, res, 1);
            }
            const v = new Validator(req.body, {
                categoryId: "required",
                latitude: "required",
                longitude: "required",
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }
            let condition1 = {
                category_id: req.body.categoryId,
                status: 1,
            }
            if (req.body.keyword) {
                condition1 = {
                    name: {
                        [Op.like]: `%${req.body.keyword}%`,
                    },
                }
            }

            let find_products = await products.findAll({
                attributes: [
                    'store_id',
                ],
                where: condition1,
                group: ["store_id"],
                raw: true

            });
            if (find_products.length > 0) {

                let storeId = [];

                find_products.map(async (items) => {
                    storeId.push(items.store_id);
                });
                let condition = {
                    id: storeId,
                    status: 1,
                    deletedAt: null,
                    role: req.body.categoryId == 1 ? 4 : 1
                }
                // if (req.body.keyword) {
                //     condition = {
                //         [Op.or]: [
                //             {
                //                 name: {
                //                     [Op.like]: `%${req.body.keyword}%`,
                //                 },
                //             },
                //         ]
                //     }
                // }
                let find_store = await users.findAll({
                    attributes: {
                        include: [
                            [
                                sequelize.literal(
                                    `6371 * acos(cos(radians(${req.body.latitude})) * cos(radians(users.latitude)) * cos(radians(${req.body.longitude}) - radians(users.longitude)) + sin(radians(${req.body.latitude})) * sin(radians(users.latitude)))`
                                ),
                                "distance",
                            ]
                        ],
                    },
                    include: [
                        {
                            model: store_details,
                            as: "store_details",
                        },
                    ],
                    where: condition,
                    having: {

                        distance: {
                            [Op.lte]: 30,
                        },
                    },
                });

                return helper.success(
                    res,
                    " store by categories  find  Succesfully ",
                    find_store
                );
            } else {
                return helper.success(
                    res,
                    "No stores found for the given category",
                    []
                );
            }
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    nearby_store: async (req, res) => {
        try {
            if (req.headers.authorization) {
                await helper.verifyUser(req, res, 1);
            }
            const v = new Validator(req.body, {
                latitude: "required",
                longitude: "required",
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }
            const storeId = await helper.getStoreId(req, res);
            let condition = {
                role: [1, 4],
                status: 1,
                deletedAt: null,
                id: storeId
            }
            // if (req.body.keyword) {
            //     condition = {
            //         [Op.or]: [
            //             {
            //                 name: {
            //                     [Op.like]: `%${req.body.keyword}%`,
            //                 },
            //             },
            //         ]
            //     }
            // }
            let find_store = await users.findAll({
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
                            `6371 * acos(cos(radians(${req.body.latitude})) * cos(radians(users.latitude)) * cos(radians(${req.body.longitude}) - radians(users.longitude)) + sin(radians(${req.body.latitude})) * sin(radians(users.latitude)))`
                        ),
                        "distance",
                    ],

                    [
                        sequelize.literal(
                            "(SELECT AVG(rating) FROM store_ratings WHERE store_ratings.store_id = users.id)"
                        ),
                        "average_rating",
                    ],
                ],

                include: [
                    {
                        model: store_details,
                        as: "store_details",
                    },
                ],

                where: condition,
                having: {
                    distance: {
                        [Op.lte]: 30,
                    },
                },
            });
            return helper.success(res, " nearby  by  store find  Succesfully ", find_store);
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    getProduct: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                product_id: "required",
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }
            let find_products = await products.findOne({
                include: [
                    {
                        model: categories,
                        as: "category",
                    },
                    {
                        model: users,
                        as: "store",
                        include: [
                            {
                                model: store_details,
                                as: "store_details",
                            },
                        ],
                    },
                ],
                where: {
                    id: req.body.product_id,
                    status: 1
                },
            });

            return helper.success(
                res,
                " product get find  Succesfully ",
                find_products
            );
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    searchStore: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                keyword: "required",
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }

            const storeData = await products.findAll({
                attributes: ['store_id'],
                where: {
                    name: {
                        [Op.like]: `${req.body.keyword}%`,
                    },
                    status: 1
                }, raw: true
            })
            const storIds = storeData.map(i => i.store_id);
            let find_store = await users.findAll({
                include: [
                    {
                        model: store_details,
                        as: "store_details",
                    },
                ],

                where: {
                    // name: {
                    //     [Op.like]: `${req.body.keyword}%`,
                    // },
                    status: 1,
                    id: storIds,
                    role: [1, 4],
                    deletedAt: null,
                },
            });

            return helper.success(
                res,
                "Search Store get find  Succesfully ",
                find_store
            );
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    storedetails: async (req, res) => {
        try {
            if (req.headers.authorization) {
                await helper.verifyUser(req, res, 1);
            }
            const v = new Validator(req.body, {
                id: "required",
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }
            let type = req.body.type;

            let productsWhereCondition = "";

            if (type !== null && type !== "") {

                if (type == 1 || type == 2) {
                    productsWhereCondition = {

                        type: Number(type),
                    };
                }
            }
            const find_store = await users.findOne({
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
                            "(SELECT AVG(rating) FROM store_ratings WHERE store_ratings.store_id = users.id)"
                        ),
                        "average_rating",
                    ],
                ],
                include: [
                    {
                        model: store_details,
                        as: "store_details",

                    },
                    {
                        model: products,
                        as: "products",
                        where: {
                            status: 1
                        }
                        // where: productsWhereCondition,
                    },
                ],
                where: {
                    id: req.body.id,
                    deletedAt: null,
                },
            });
            const prodt = await products.findAll({
                attributes: ['subcategory_id'],
                where: {
                    store_id: req.body.id,
                    ...productsWhereCondition,
                    status: 1

                },
                raw: true,
            });
            const subcategoryIds = prodt.map(product => product.subcategory_id);
            const uniqueSubcategoryIds = [...new Set(subcategoryIds)];
            const subcate = await subcategories.findAll({
                where: {
                    id: uniqueSubcategoryIds
                },
                include: [
                    {
                        model: products,
                        as: "products",
                        where: {
                            store_id: req.body.id,
                            ...productsWhereCondition,
                            status: 1
                        },
                        raw: true,
                    },
                ],
            });
            let obj = {
                find_store,
                subcate
            }
            return helper.success(
                res,
                " Get  store details  Succesfully ",
                obj
            );
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    all_store: async (req, res) => {
        try {
            if (req.headers.authorization) {
                await helper.verifyUser(req, res, 1);
            }
            const v = new Validator(req.body, {
                latitude: "required",
                longitude: "required",
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }
            let where = {}; // Define 'where' object outside the conditionals
            let having = {}; // Define 'having' object outside the conditionals

            if (req.body.type == 2) {
                let find_products = await products.findAll({
                    where: {
                        category_id: req.body.categoryId,
                        status: 1,
                    },
                });

                let get_ids = find_products.map((items) => items.store_id);

                const uniqueSet = new Set(get_ids);
                var storeId = Array.from(uniqueSet);
            }

            if (req.body.type == 1) {
                where = {
                    name: {
                        [Op.like]: `${req.body.keyword}%`,
                    },
                    role: [1, 4],
                    status: 1,
                    deletedAt: null,
                };
            } else if (req.body.type == 2) {
                where = {
                    id: storeId,
                    deletedAt: null,
                };
            } else {
                (where = {
                    role: [1, 4],
                    status: 1,
                    deletedAt: null,
                }),
                    (having = {
                        distance: {
                            [Op.lte]: 10,
                        },
                    });
            }
            let find_store = await users.findAll({
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
                            `6371 * acos(cos(radians(${req.body.latitude})) * cos(radians(users.latitude)) * cos(radians(${req.body.longitude}) - radians(users.longitude)) + sin(radians(${req.body.latitude})) * sin(radians(users.latitude)))`
                        ),
                        "distance",
                    ],
                    [
                        sequelize.literal(
                            "(SELECT AVG(rating) FROM store_ratings WHERE store_ratings.store_id = users.id)"
                        ),
                        "average_rating",
                    ],
                ],
                include: [
                    {
                        model: store_details,
                        as: "store_details",
                    },
                ],
                where: where,
                having: having,
            });

            return helper.success(res, "Find stores successfully", find_store);
        } catch (error) {
            // Handle the error appropriately
            console.error(error);
            return helper.error400(res, "Internal Server Error");
        }
    },
    getProductbysubcategory: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                sub_category_id: "required",
                // store_id:"required",
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }
            let find_products = await products.findAll({
                include: [
                    {
                        model: subcategories,
                        as: "subcategory",
                        where: {
                            id: req.body.sub_category_id,

                        },
                    },
                ],
                where: {
                    subcategory_id: req.body.sub_category_id,
                    store_id: req.body.store_id,
                    status: 1
                },
            });

            return helper.success(
                res,
                "Products fetched successfully based on sub_category_id",
                find_products
            );
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    getRestaurantbyCuisines: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                cuisine_id: "required",
            });

            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }
            let find_restraunt = await restaurant_cuisines.findAll({
                include: [
                    {
                        model: users,
                        as: "restaurant",
                        // include: [
                        //     {
                        //         model: store_details,
                        //         as: "storeDetails", 
                        //         where: {
                        //             store_id: sequelize.literal('restaurant.id'),
                        //         },
                        //     },
                        // ],
                    },

                ],
                where: {
                    cuisine_id: req.body.cuisine_id,
                },
            });

            return helper.success(
                res,
                "Restaurant fetched successfully based on cuisine_id",
                find_restraunt
            );

        } catch (error) {
            console.error(error);
            return helper.error400(res, "Internal Server Error");
        }

    },
    bannerByStoreId: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                store_id: "required",
            });

            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }
            let find_banner = await banner_details.findAll({

                where: {
                    status: 1,
                    store_id: req.body.store_id,
                },
                order: [
                    ['id', 'DESC'] // Order by id in descending order
                ],
                limit: 1,
            });

            return helper.success(
                res,
                "Banner Image fetched successfully based on store id",
                find_banner
            );

        } catch (error) {
            console.error(error);
            return helper.error400(res, "Internal Server Error");
        }

    },
    getstorerating: async (req, res) => {
        try {

            const v = new Validator(req.body, {
                store_id: "required",
            });

            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }

            const find_store_ratings = await storeRating.findAll({
                where: {
                    store_id: req.body.store_id,
                },
            });

            if (!find_store_ratings || find_store_ratings.length === 0) {
                return helper.error403(res, 'Store ratings not found for the specified store_id');
            }

            return helper.success(
                res,
                'Store Reviews & Ratings fetched successfully',
                find_store_ratings
            );
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    getTypeByStoreId: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                store_id: "required",
                type: "required"
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error403(res, errorsResponse);
            }

            const find_product_type = await products.findAll({
                where: {
                    store_id: req.body.store_id,
                    type: req.body.type,
                    status: 1
                },
            });
            return helper.success(
                res,
                'Store Data By Type fetched successfully',
                find_product_type
            );
        } catch (error) {
            return helper.error403(res, error);
        }
    },
    getReasons: async (req, res) => {
        try {
            const reasonsData = await reasons.findAll({
                where: {
                    status: 1
                }, raw: true
            });
            return helper.success(
                res,
                'reasons Data fetched successfully',
                reasonsData
            );
        } catch (error) {
            return helper.error403(res, error);
        }
    }
};