const Sequelize = require ('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define (
    'orders',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      unique_id: {
        type: DataTypes.STRING (255),
        allowNull: false,
      },
      order_date: {
        type: DataTypes.STRING (100),
        allowNull: false,
      },
      reason_id: {
        type: DataTypes.INTEGER (11),
        allowNull: false,
        defaultValue:0
      },
      transaction_id: {
        type: DataTypes.STRING (100),
        allowNull: true,
        defaultValue:""
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      driver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payment_mode: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      card_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValues:0
      },
      driver_fee: {
        type: DataTypes.STRING (100),
        allowNull: false,
      },
      sub_total: {
        type: DataTypes.STRING (100),
        allowNull: false,
      },
      service_fee: {
        type: DataTypes.STRING (100),
        allowNull: false,
      },
      total: {
        type: DataTypes.STRING (100),
        allowNull: false,
      },
      instructions: {
        type: DataTypes.STRING (255),
        allowNull: false,
        defaultValues:""
      },
      delivery_time: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValues:""
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      payment_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        // defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        // defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'updated_at',
      },
      deletedAt: {
        type: DataTypes.DATE,
        defaultValue: null,
        field: 'deleted_at',
      },
      tip: {
        type: DataTypes.STRING (100),
        allowNull: false,
        defaultValue: null,
      },
    },
    {
      sequelize,
      tableName: 'orders',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{name: 'id'}],
        },
      ],
    }
  );
};
