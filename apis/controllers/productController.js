const db = require("../models");
const helper = require("../helper/helper");
const sequelize = require("sequelize");
const store_details = db.store_details;
const users = db.users;
const products = db.products;
const categories = db.categories;
const banner_details = db.banner_details;
const orders = db.orders;
const order_details = db.order_details;
const cards = db.cards;
const addresses = db.addresses;

module.exports = {
  productList: async (req, res) => {
    try {

    } catch (err) {
      helper.error (res, err);
    }
  },
  productDetail: async (req, res) => {
    try {

    } catch (err) {
      helper.error (res, err);
    }
  },
  likeProduct: async (req, res) => {
    try {

    } catch (err) {
      helper.error (res, err);
    }
  },
};