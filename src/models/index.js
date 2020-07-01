var fs = require("fs");
var path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

var sequelize = new Sequelize("test1", "root", "", {
  host: "localhost",
  dialect: "mysql",
  operatorsAliases: false,
});
var db = {};

fs.readdirSync(__dirname)
  .filter(function (file) {
    return file.indexOf(".") !== 0 && file !== "index.js";
  })
  .forEach(function (file) {
    var model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
    console.log(model.name);
  });

Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
