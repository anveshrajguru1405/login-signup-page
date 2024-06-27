// userController.js
const userModel = require("../models/userModel");

const createUser = async (req, res) => {
  try {
    const userData = await userModel.createUser(req.body);
    req.session.data = { values: userData };
    res.redirect("/success");
  } catch (err) {
    console.error(err);
    res.status(500).json({ Success: false, error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userData = await userModel.login(email, password);
    if (userData) {
      res.render("logindata", { data: userData });
    } else {
      res.render("loginFailed");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ Success: false, error: err.message });
  }
};

const showSuccessPage = (req, res) => {
  const data = req.session.data || null;
  res.render("userdata", { data });
  req.session.data = null;
};

module.exports = {
  createUser,
  login,
  showSuccessPage,
};
