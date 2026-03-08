const Facture = require("../models/Facture");

exports.createFacture = async (req, res) => {
    try {
        const { client, montant, dateEmission } = req.body;
        const facture = await Facture.create({
            client,
            montant,
            dateEmission,
            statut: "impayee"
        });
        res.status(201).json(facture);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la facture", error: error.message });
    }
};

exports.getFactures = async (req, res) => {
    try {
        // Optionally filter by client or statut
        const filter = {};
        if (req.query.client) filter.client = req.query.client;
        if (req.query.statut) filter.statut = req.query.statut;

        const factures = await Facture.find(filter).populate("client", "name email");
        res.status(200).json(factures);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des factures", error: error.message });
    }
};

exports.getFactureById = async (req, res) => {
    try {
        const facture = await Facture.findById(req.params.id).populate("client", "name email phone address");
        if (!facture) {
            return res.status(404).json({ message: "Facture non trouvée" });
        }
        res.status(200).json(facture);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la facture", error: error.message });
    }
};

exports.updateFacture = async (req, res) => {
    try {
        const facture = await Facture.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!facture) {
            return res.status(404).json({ message: "Facture non trouvée" });
        }
        res.status(200).json(facture);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la facture", error: error.message });
    }
};

exports.deleteFacture = async (req, res) => {
    try {
        const facture = await Facture.findByIdAndDelete(req.params.id);
        if (!facture) {
            return res.status(404).json({ message: "Facture non trouvée" });
        }
        res.status(200).json({ message: "Facture supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la facture", error: error.message });
    }
};
