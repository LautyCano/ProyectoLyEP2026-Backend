const express = require('express');
const router = express.Router();
const {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} = require('../controllers/clientController');
const {
  validateClientId,
  validateCreateClient,
  validateUpdateClient
} = require('../middleware/clientValidator');

router.get('/', getAllClients);
router.get('/:id', validateClientId, getClientById);
router.post('/', validateCreateClient, createClient);
router.put('/:id', validateClientId, validateUpdateClient, updateClient);
router.delete('/:id', validateClientId, deleteClient);

module.exports = router;


