const jwt = require("jsonwebtoken");
const Joi = require("joi");

module.exports = function (sequelize, Sequelize) {
  var CompanySchema = sequelize.define(
    "Company",
    {
      company_name: Sequelize.STRING,
      company_email: Sequelize.STRING,
      company_website: Sequelize.STRING,
      company_address: Sequelize.STRING,
      company_phone: Sequelize.STRING,
    },
    {
      timestamps: false,
    }
  );

  return CompanySchema;
};
