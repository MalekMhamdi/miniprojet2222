// src/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");

/**
 * Middleware pour protéger les routes (vérifie le token JWT)
 */
const protect = (req, res, next) => {
  try {
    // Vérifie le header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Non autorisé, pas de token" });
    }

    const token = authHeader.split(" ")[1];

    // Vérifie et décode le token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "recouvra_secret"
    );

    req.user = decoded; // ajoute les infos utilisateur dans la requête

    next();
  } catch (err) {
    return res.status(401).json({ message: "Non autorisé, token invalide" });
  }
};

/**
 * Middleware pour restreindre l’accès selon le rôle
 * @param  {...string} roles - Liste des rôles autorisés
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Non autorisé, pas de token" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Vous n'avez pas la permission pour effectuer cette action",
      });
    }

    next();
  };
};

module.exports = { protect, restrictTo };