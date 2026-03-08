const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/recouvraplus");
    console.log("✅ Connexion réussie à MongoDB");
  } catch (error) {
    console.error("❌ Erreur de connexion :", error);
    process.exit(1);
  }
};

module.exports = connectDB;