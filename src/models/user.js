const jwt = require("jsonwebtoken");
const Joi = require("joi");

module.exports = function (sequelize, Sequelize) {
  var UserSchema = sequelize.define(
    "User",
    {
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.STRING,
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return UserSchema;
};
