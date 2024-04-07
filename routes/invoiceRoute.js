const express = require('express');
const router = express.Router(); // Creates an instance of Express router

const {
   createInvoice,
   getInvoice
} = require('../controller/invoiceController'); // Importing the createInvoice controller function

// Define route for creating invoices
router.post('/createInvoice', createInvoice);
router.get('/getInvoice', getInvoice);

module.exports = router; // Export the router for use in other parts of the application
