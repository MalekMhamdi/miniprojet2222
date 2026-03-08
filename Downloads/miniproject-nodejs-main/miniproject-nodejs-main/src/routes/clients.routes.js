const express = require("express");
const router = express.Router();
const clientController = require("../controllers/Client.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

// Protéger toutes les routes
router.use(protect);

router
    .route("/")
    .post(restrictTo("admin", "manager"), clientController.createClient)
    .get(clientController.getClients);

router
    .route("/:id")
    .get(clientController.getClientById)
    .put(restrictTo("admin", "manager"), clientController.updateClient)
    .delete(restrictTo("admin"), clientController.deleteClient);

module.exports = router;
