const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transections', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0
    },
    payment_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0
    },
    transectionId: {
      type: DataTypes.STRING(255),
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
    deletedAt:{
      type: DataTypes.DATE,
			allowNull: true,
      field:"deleted_at"
    }
  }, {
    sequelize,
    tableName: 'transections',
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
