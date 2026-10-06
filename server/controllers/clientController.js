const mongoose = require('mongoose');
const Client = require('../models/clientModel');

const getAllClients = async (req, res, next) => {
  try {
    const clients = await Client.find();
    return res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
};

const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'El ID proporcionado no tiene un formato válido de MongoDB'
      });
    }

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({
        message: 'Cliente no encontrado'
      });
    }

    return res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllClients,
  getClientById
};
