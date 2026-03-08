const Facture = require("../models/Facture");
const Paiement = require("../models/Paiement");

exports.getStats = async (req, res) => {
  try {
    // Nombre total de factures
    const totalFactures = await Facture.countDocuments();

    // Montant total des factures
    const montantGlobalResult = await Facture.aggregate([
      { $group: { _id: null, total: { $sum: "$montant" } } }
    ]);

    const montantGlobalFactures =
      montantGlobalResult.length > 0 ? montantGlobalResult[0].total : 0;

    // Montant total des paiements
    const montantPayeResult = await Paiement.aggregate([
      { $group: { _id: null, total: { $sum: "$montant" } } }
    ]);

    const montantTotalRecouvre =
      montantPayeResult.length > 0 ? montantPayeResult[0].total : 0;

    // Reste à recouvrer
    const resteARecouvrer =
      montantGlobalFactures - montantTotalRecouvre;

    // Nombre de factures par statut
    const statusCounts = await Facture.aggregate([
      { $group: { _id: "$statut", count: { $sum: 1 } } }
    ]);

    const facturesParStatut = {};

    statusCounts.forEach((item) => {
      facturesParStatut[item._id] = item.count;
    });

    // Réponse
    res.status(200).json({
      totalFactures,
      montantGlobalFactures,
      montantTotalRecouvre,
      resteARecouvrer,
      facturesParStatut
    });

  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des statistiques",
      error: error.message
    });
  }
};