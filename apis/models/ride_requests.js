const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ride_requests', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    order_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0
    },
    driver_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0
    },
    reason_id: {
      type: DataTypes.INTEGER (11),
      allowNull: false,
      defaultValue:0

    },
    assign:{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0
    },
    status:{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0
    },
    reject:{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0
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
      field:"updated_at"
    },

  }, {
    sequelize,
    tableName: 'ride_requests',
    timestamps: true,
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
