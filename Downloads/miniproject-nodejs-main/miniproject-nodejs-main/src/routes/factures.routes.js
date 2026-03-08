const express = require("express");
const router = express.Router();
const factureController = require("../controllers/facture.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { createFactureSchema } = require("../validations/facture.validation");

router.use(protect);

router
  .route("/")
  .post(
    restrictTo("admin", "manager"),
    validate(createFactureSchema),   // ✅ AJOUT ICI
    factureController.createFacture
  )
  .get(factureController.getFactures);

router
  .route("/:id")
  .get(factureController.getFactureById)
  .put(restrictTo("admin", "manager"), factureController.updateFacture)
  .delete(restrictTo("admin"), factureController.deleteFacture);

module.exports = router;