const express = require('express');
const router = express.Router(); // Creates an instance of Express router
const {
    updateCategory
} = require('../controller/categoryController'); // Importing the createInvoice controller function

// Define route for creating invoices
router.put('/updateCategory', updateCategory);


module.exports = router; 