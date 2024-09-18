const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      default: ""
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      default: ""
    },
    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
      default: 0
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
      default: "http://3.230.224.91:2020/images/users/user.png"
    },
    stripe_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      default: ""
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      default: ""
    },
    country_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
      default: ""
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true,
      default: ""
    },
    referral_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
      default: ""
    },
    referred_by: {
      type: DataTypes.STRING(255),
      allowNull: true,
      default: ""
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,

    },
    otp: {
      type: DataTypes.STRING(255),
      allowNull: true,
     
    },
    verify_otp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    latitude: {
      type: DataTypes.STRING(255),
      allowNull: true,
      default: ""
    },
    longitude: {
      type: DataTypes.STRING(255),
      allowNull: true,
      default: ""
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: true,
      default: ""
    },
    house_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
      default: ""
    },
    driver_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      default: ""
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true,
      default: ""
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      default: ""
    },
    postal_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
      default: ""
    },
    notification_on: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    device_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    device_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      default: ""
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    verify_driver: {
      type: DataTypes.STRING(255),
      allowNull: true,
      default: ""
    },
    wallet_amount: {
      type: DataTypes.STRING(255),
      allowNull: true,
      default: ""
    },
    job_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    availability: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    remember_token: {
      type: DataTypes.STRING(100),
      allowNull: true,
      default: ""
    },
    social_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: 0
    },
    google_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      default: ""
    },
    facebook_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      default: ""
    },
    apple_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      default: ""
    },
    stripeAccountId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    hasAccountId: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false 
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
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "deleted_at"
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ],
      },
    ]
  });
};
