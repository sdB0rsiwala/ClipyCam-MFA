const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isNumeric: true,
            len: [10, 15], // Ensures phone number length is between 10-15 digits
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otp_code: {
        type: DataTypes.STRING,
        allowNull: true, // OTP is temporary
    },
    otp_expiry: {
        type: DataTypes.DATE,
        allowNull: true, // Expiry time for OTP
    },
}, {
    timestamps: false,
});

module.exports = User;
