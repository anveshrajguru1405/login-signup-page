// index.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/user", userController.createUser);
router.post("/login", userController.login);
router.get("/success", userController.showSuccessPage);

module.exports = router;
