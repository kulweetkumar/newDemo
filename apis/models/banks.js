const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('banks', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0
    },
    bank_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue:""
    },
    branch_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue:""
    },
    ifsc_code: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    account_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue:""
    },
    routing_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue:""
    },
    account_holder_name:{
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue:""
    },
    is_active: {
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
    deletedAt:{
                      type: DataTypes.DATE,

			allowNull: true,
      field:"deleted_at"
    }

  }, {
    sequelize,
    tableName: 'banks',
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
