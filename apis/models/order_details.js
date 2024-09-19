const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "order_details",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                primaryKey: true,
            },
            order_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            store_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            product_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                defaultValue: "",
            },
            product_image: {
                type: DataTypes.TEXT,
                allowNull: false,
                defaultValue: "",
            },
            product_description: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: "",
            },
            price: {
                type: DataTypes.STRING(100),
                allowNull: false,
                defaultValue: "",
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
                field: "created_at",
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
                field: "updated_at",
            },
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true,
                field: "deleted_at",
            },
        },
        {
            sequelize,
            tableName: "order_details",
            timestamps: true,
            paranoid: true,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
            ],
        }
    );
};
