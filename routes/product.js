// Dependencies and Modules
const express = require('express');
const productController = require('../controllers/product');
const auth = require('../authorization');

// API Verification token
const { verify, verifyAdmin } = auth;

// Routing Component
const router = express.Router();

// List of Routes
// Create a product exclusive for admin accounts
router.post('/createProduct', verify, verifyAdmin, productController.createNewProduct);

// Retrieve all products in the database
router.get('/viewAllProducts',  productController.showAllProduct);

// Retrieve all active products in the database for admin
router.get('/viewActiveProducts', verify, verifyAdmin, productController.showActiveProduct);

// Search a specific product by its name
router.post('/searchByName', productController.searchProductName);

// Retrieve single product details
router.get('/:productId/viewProduct', productController.showProduct);

// Update Product Information only for admin users
router.put('/:productId/update', verify, verifyAdmin, productController.updateProduct) ;

// Archives a product from the database
router.put('/:productId/archive', verify, verifyAdmin, productController.archiveSelectedProduct);

// Activates a product from the database
router.put('/:productId/activate', verify, verifyAdmin, productController.activateSelectedProduct);

module.exports = router;