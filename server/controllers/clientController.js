const mongoose = require('mongoose');
const Client = require('../models/clientModel');

const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    return res.status(200).json(clients);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener los clientes',
      error: error.message
    });
  }
};

const getClientById = async (req, res) => {
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
    return res.status(500).json({
      message: 'Error al obtener el cliente',
      error: error.message
    });
  }
};

module.exports = {
  getAllClients,
  getClientById
};
