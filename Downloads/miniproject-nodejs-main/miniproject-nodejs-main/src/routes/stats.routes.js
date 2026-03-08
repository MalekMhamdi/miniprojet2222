const express = require("express");
const router = express.Router();
const statsController = require("../controllers/stats.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

router.use(protect);

router.get("/", restrictTo("admin", "manager"), statsController.getStats);

module.exports = router;
