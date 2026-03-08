const mongoose = require("mongoose");

const paiementSchema = new mongoose.Schema(
  {
    facture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facture",
      required: true
    },
    montant: {
      type: Number,
      required: true,
      min: 0
    },
    datePaiement: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Paiement", paiementSchema);