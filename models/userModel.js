// userModel.js
const connection = require("../db");

const createUser = (userData) => {
  return new Promise((resolve, reject) => {
    // ... (unchanged code)
  });
};

const login = (email, password) => {
  return new Promise((resolve, reject) => {
    // ... (unchanged code)
  });
};

module.exports = {
  createUser,
  login,
};
