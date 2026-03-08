const ActionRecouvrement = require("../models/ActionRecouvrement");
const Facture = require("../models/Facture");
const Joi = require("joi");

const actionSchema = Joi.object({
    facture: Joi.string().required(),
    type: Joi.string().valid("appel", "email", "visite").required(),
    commentaire: Joi.string().allow("").optional()
});

exports.enregistrerAction = async (req, res) => {
    try {
        const { error } = actionSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { facture, type, commentaire } = req.body;

        const factureExists = await Facture.findById(facture);
        if (!factureExists) {
            return res.status(404).json({ message: "Facture non trouvée" });
        }

        const action = await ActionRecouvrement.create({
            facture,
            agent: req.user.id,
            type,
            commentaire
        });

        res.status(201).json(action);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'enregistrement de l'action", error: error.message });
    }
};

exports.getActions = async (req, res) => {
    try {
        const filter = {};
        if (req.query.facture) filter.facture = req.query.facture;

        const actions = await ActionRecouvrement.find(filter)
            .populate("agent", "name")
            .populate({
                path: "facture",
                populate: { path: "client", select: "name" }
            });

        res.status(200).json(actions);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des actions", error: error.message });
    }
};
