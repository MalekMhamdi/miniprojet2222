const express = require("express");
const router = express.Router();
const paiementController = require("../controllers/paiement.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

router.use(protect);

router
    .route("/")
    .post(restrictTo("admin", "manager", "agent"), paiementController.enregistrerPaiement)
    .get(paiementController.getPaiements);

module.exports = router;
