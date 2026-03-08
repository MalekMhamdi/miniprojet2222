const mongoose = require("mongoose");

const actionRecouvrementSchema = new mongoose.Schema(
  {
    facture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facture",
      required: true
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["appel", "email", "visite"],
      required: true
    },
    commentaire: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActionRecouvrement", actionRecouvrementSchema);