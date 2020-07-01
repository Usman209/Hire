const auth = require("../src/middlewares/auth");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const User = require("../src/models").User;
// const {validate} = require('../src/models/user')
// var Book = require("../src/models").Book;

const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user._id);
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  console.log("body", req.body);

  let user = await User.findOne({ where: { email: req.body.email } });
  console.log("here user :", user);
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  console.log(user);
  const token = jwt.sign(
    { email: user.email, isAdmin: user.isAdmin },
    "jwtPrivateKey"
  );
  res.header("token", token).send(_.pick(user, ["_id", "name", "email"]));
});

function validate(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(user, schema);
}

module.exports = router;
