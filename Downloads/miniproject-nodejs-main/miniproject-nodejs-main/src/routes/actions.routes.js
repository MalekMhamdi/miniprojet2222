const express = require("express");
const router = express.Router();
const actionController = require("../controllers/action.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

router.use(protect);

router
    .route("/")
    .post(restrictTo("admin", "manager", "agent"), actionController.enregistrerAction)
    .get(actionController.getActions);

module.exports = router;
