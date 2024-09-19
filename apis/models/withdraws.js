const Sequelize = require ('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define (
    'withdraws',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      bankid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      payment_transfer: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0, // 0 pending 1 transfer 
      },
      price: {
        type: DataTypes.STRING (100),
        allowNull: true,
        default: '',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
    },
    {
      sequelize,
      tableName: 'withdraws',
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
