const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cards', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },

    isDefault: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    card_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    card_number: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    card_expiry_date: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    stripe_card_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    cvv: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    tableName: 'cards',
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
