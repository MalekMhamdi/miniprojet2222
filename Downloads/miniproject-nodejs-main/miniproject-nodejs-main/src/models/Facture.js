const mongoose = require("mongoose");

const factureSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true
    },
    montant: {
      type: Number,
      required: true,
      min: 0
    },
    statut: {
      type: String,
      enum: ["impayee", "partielle", "payee"],
      default: "impayee"
    },
    dateEmission: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Facture", factureSchema);