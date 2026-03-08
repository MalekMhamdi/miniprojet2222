const Paiement = require("../models/Paiement");
const Facture = require("../models/Facture");

exports.enregistrerPaiement = async (req, res) => {
    try {
        const { facture: factureId, montant, datePaiement } = req.body;

        const facture = await Facture.findById(factureId);
        if (!facture) {
            return res.status(404).json({ message: "Facture non trouvée" });
        }

        if (facture.statut === "payee") {
            return res.status(400).json({ message: "Cette facture est déjà totalement payée" });
        }

        const paiement = await Paiement.create({
            facture: factureId,
            montant,
            datePaiement
        });

        // Recalculate totals to update the facture status
        const allPaiements = await Paiement.find({ facture: factureId });
        const totalPaye = allPaiements.reduce((sum, p) => sum + p.montant, 0);

        if (totalPaye >= facture.montant) {
            facture.statut = "payee";
        } else {
            facture.statut = "partielle";
        }

        await facture.save();

        res.status(201).json({
            message: "Paiement enregistré avec succès",
            paiement,
            nouveauStatutFacture: facture.statut,
            resteAPayer: Math.max(0, facture.montant - totalPaye)
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'enregistrement du paiement", error: error.message });
    }
};

exports.getPaiements = async (req, res) => {
    try {
        const filter = {};
        if (req.query.facture) filter.facture = req.query.facture;

        const paiements = await Paiement.find(filter).populate({
            path: "facture",
            populate: { path: "client", select: "name" }
        });

        res.status(200).json(paiements);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des paiements", error: error.message });
    }
};
