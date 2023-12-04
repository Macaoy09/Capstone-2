// Dependecies and Modules
const express = require('express');
const userController = require('../controllers/user');
const auth = require('../authorization')

const { verify, verifyAdmin } = auth;

// Routing Components
const router = express.Router();

// List of routes
// Register user
router.post('/register', (req, res) => {
    userController.userRegistration(req.body).then(result => res.send(result))
});

// Login User & User Authentication
router.post('/login', userController.userLogin);

// Non admin checkout route
router.put('/checkout', verify, userController.createOrder);

// Retrieve user details
router.get('/:userId/details', verify, userController.showDetails);

// Set non-admin user into admin user
router.put('/setAsAdmin', verify, verifyAdmin, userController.setAsAdmin);

// Retrieve all Order for admin users
router.get('/orders', verify, verifyAdmin, userController.getAllOrders)

// Retrieves user own details of the order
router.get('/myOrders', verify, userController.getMyOrders)

// Export Route System
module.exports = router;