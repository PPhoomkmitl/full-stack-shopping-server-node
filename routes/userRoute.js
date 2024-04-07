const express = require('express');
const router = express.Router(); 
const { 
    createUser,
    blockUser,
    updateUser
} = require('../controller/userController'); 
// updateUser, 
// Define route for updating user
// router.put('/updateUser', updateUser);

// Define route for creating user
router.post('/createUser', createUser);
router.put('/blockUser/:id', blockUser);
router.put('/updateUser', updateUser);

module.exports = router;