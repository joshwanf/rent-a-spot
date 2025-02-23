// backend/routes/api/users.js
const express = require("express");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Username is required"),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("First Name is required"),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Last Name is required"),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

// Sign up
router.post("/", validateSignup, async (req, res, next) => {
  const { email, firstName, lastName, password, username } = req.body;
  const existingUser = await User.findOne({
    where: { [Op.or]: [{ email: email }, { username: username }] },
    attributes: ["email", "username"],
  });
  if (existingUser) {
    const err = new Error();
    // err.title = "Couldn't sign up user!";
    if (existingUser.username === username) {
      err.username = "User with that username already exists";
    }
    if (existingUser.email === email) {
      err.email = "User with that email already exists";
    }
    // err.status = 500;
    return res.status(500).json(err);
  }

  const hashedPassword = bcrypt.hashSync(password);
  // console.log("right before create");
  const user = await User.create({
    email,
    username,
    hashedPassword,
    firstName,
    lastName,
  });

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.status(201).json({
    user: safeUser,
  });
});

module.exports = router;
