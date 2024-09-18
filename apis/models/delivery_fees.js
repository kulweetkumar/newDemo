const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('delivery_fees', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    distance_from: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    distance_to: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    price: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    }, createdAt: {
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
    }
  }, {
    sequelize,
    tableName: 'delivery_fees',
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