require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/recouvra";

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Connecté à MongoDB ");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT} 🚀`);
        });
    })
    .catch((error) => {
        console.error("Erreur de connexion à MongoDB ", error);
        process.exit(1);
    });
