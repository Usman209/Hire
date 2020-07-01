const auth = require("../src/middlewares/auth");
const admin = require("../src/middlewares/admin");
const Company = require("../src/models").Company;
const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const company = await Company.findAll();
  res.send(company);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let company = new Company({
    company_name: req.body.company_name,
    company_email: req.body.company_email,
    company_website: req.body.company_website,
    company_address: req.body.company_address,
    company_phone: req.body.company_phone,
  });
  company = await company.save();

  res.send(company);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const company = await Company.findByPk(req.params.id);

  if (!company)
    return res.status(404).send("The company with the given ID was not found.");

  Company.update(
    {
      company_name: req.body.company_name,
      company_email: req.body.company_email,
      company_website: req.body.company_website,
      company_address: req.body.company_address,
      company_phone: req.body.company_phone,
    },
    { where: { id: req.params.id } }
  );

  res.send(company);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const company = req.params.id;
  if (!company)
    return res.status(404).send("The company with the given ID was not found.");
  Company.destroy({
    where: { id: company },
  });
  res.send(company);
});

router.get("/:id", async (req, res) => {
  const company = await Company.findByPk(req.params.id);

  if (!company)
    return res.status(404).send("The company with the given ID was not found.");

  res.send(company);
});

function validate(company) {
  const schema = {
    company_name: Joi.string().min(3).required(),
    company_email: Joi.string().allow(),
    company_website: Joi.string().allow(),
    company_address: Joi.string().allow(),
    company_phone: Joi.string().allow(),
  };

  return Joi.validate(company, schema);
}

module.exports = router;
