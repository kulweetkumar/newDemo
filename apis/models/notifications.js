const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notifications', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue:""
    },
    order_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0
    },
    is_read: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0 
    },
    createdAt: {
      type: DataTypes.DATE,
			allowNull: false,
			field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
			allowNull: false,
      field:"updated_at"
    },
    deletedAt:{
      type: DataTypes.DATE,
			allowNull: true,
      field:"deleted_at",
      default:null
    }
  }, {
    sequelize,
    tableName: 'notifications',
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
