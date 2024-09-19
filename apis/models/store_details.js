const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('store_details', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    service_fee: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "0"
    },
    admin_commission: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "0"
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: "updated_at"
    },
    deletedAt: {
      type: DataTypes.DATE,

      allowNull: true,
      field: "deleted_at"
    },
    open_time: {
      type: DataTypes.TIME,

      allowNull: true,
      field: "open_time"
    },
    close_time: {
      type: DataTypes.TIME,

      allowNull: true,
      field: "close_time"
    }
  }, {
    sequelize,
    tableName: 'store_details',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
