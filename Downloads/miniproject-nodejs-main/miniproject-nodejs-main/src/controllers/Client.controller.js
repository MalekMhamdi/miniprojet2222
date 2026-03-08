const Client = require("../models/Client");

exports.createClient = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const client = await Client.create({ name, email, phone, address });
        res.status(201).json(client);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du client", error: error.message });
    }
};

exports.getClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des clients", error: error.message });
    }
};

exports.getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: "Client non trouvé" });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du client", error: error.message });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!client) {
            return res.status(404).json({ message: "Client non trouvé" });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du client", error: error.message });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) {
            return res.status(404).json({ message: "Client non trouvé" });
        }
        res.status(200).json({ message: "Client supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du client", error: error.message });
    }
};
