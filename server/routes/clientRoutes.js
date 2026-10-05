const express = require('express');
const router = express.Router();
const {
  getAllClients,
  getClientById
} = require('../controllers/clientController');

router.get('/', getAllClients);
router.get('/:id', getClientById);

module.exports = router;
