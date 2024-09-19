const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('faqs', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        question: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        answer: {
            type: DataTypes.INTEGER,
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
            field: "updated_at"
        },
        deletedAt:{
            type: DataTypes.DATE,

  allowNull: true,
field:"deleted_at"
}
    }, {
        sequelize,
        tableName: 'faqs',
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
