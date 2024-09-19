var DataTypes = require("sequelize").DataTypes;
var _socketuser = require("./socketuser");

function initModels(sequelize) {
  var socketuser = _socketuser(sequelize, DataTypes);


  return {
    socketuser,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
