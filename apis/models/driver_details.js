const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('driver_details', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0
    },
    licence_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
     
    licence_image_front: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    licence_image_back: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    licence_number: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    issue_date: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    expiry_date: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nationality: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    insurance_image_front: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    insurance_image_back: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue:""
    },
    insurance_number: {
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
    tableName: 'driver_details',
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
