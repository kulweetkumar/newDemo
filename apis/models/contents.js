const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contents', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
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
    tableName: 'contents',
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
