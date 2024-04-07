const express = require('express');
const router = express.Router(); // Creates an instance of Express router
const {
    updateProduct
} = require('../controller/productController'); // Importing the createInvoice controller function

// Define route for creating invoices
router.put('/updateProduct', updateProduct);


module.exports = router; 