// Dependencies and Modules
const Product = require('../models/Product');
const User = require('../models/User');

// Creates a new product only admin can do
module.exports.createNewProduct = (req, res) => {
    const { name, description, imgUrl, price } = req.body;
    const newProduct = new Product({
        name,
        description,
        imgUrl,
        price
    })

    // validation for user if the login user is an admin account
    return User.findById(req.user.id).then(user => {
        if(user.isAdmin === true){
            console.log(user.isAdmin)
            return newProduct.save().then((createdProduct, error) => {
                if(error){
                    return res.status(422).send('Failed creating a product');
                } else {
                    return res.send({ message: 'Product created successfully!', product: createdProduct });
                }
            })
        } else {
            return res.status(403).send('Access Denied!');
        }
    }).catch(error => res.status(500).send({ message: 'Internal Error', err: error }));

}

// Shows all products available in database
module.exports.showAllProduct = (req, res) => {

    // Requires no validation to view all products
    return Product.find({}).then(allProducts => {
        return res.send({ message: 'Here are the list of all our products', productList: allProducts});

    }).catch(error => res.status(500).send({ message: 'Internal Error', err: error }));
}

// Shows all active products exclusive for admin users
module.exports.showActiveProduct = (req, res) => {

    // validation for user if the login user is an admin account
    return User.findById(req.user.id).then(user => {
        if(user.isAdmin === true){
            return Product.find({ isActive : true }).then(activeProduct =>{
                return res.send({ message: 'Here are the list of our active products', productList:  activeProduct})
            })
        } else {
            return res.status(403).send({ message: 'Access Denied'})
        }
    }).catch(error => res.status(500).send({ message: 'Internal Error', err: error }));
}

// Search specific product by its name
module.exports.searchProductName = async (req, res) => {
    try {
      const { name } = req.body;
  
      // Use a regular expression to perform a case-insensitive search
      const products = await Product.find({
        name: { $regex: name, $options: 'i' }
      });
  
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Shows specific products and its details
module.exports.showProduct = (req, res) => {

    return Product.findById(req.params.productId).then(product => {
        if(product){
            return res.send({ name: product.name, details: product })
        } else {
            return res.status(404).send({ message: 'Product not found' })
        }
    }).catch(error => res.status(500).send({ message: 'Internal Error', err: error }));
}

// Update product details this method is for admin users only
/*
reminders:
1. add a function or method where in the req.params.productId is not available in the database it will return an error
*/
module.exports.updateProduct = (req, res) => {
    const { name, description, price } = req.body;
    const update = ({
        name,
        description,
        price,
        
    })

    // Validation for user if the login account is admin
    return User.findById(req.user.id).then(user => {
        if(user.isAdmin === true) {

            return Product.findByIdAndUpdate(req.params.productId, update).then((product, error) => {
                if(error){
                    return res.status(404).send({ message: 'Update failed'})
                } else {
                    return res.send({ message: 'Update successful', details: update })
                }
            })
            
        } else {
            return res.status(403).send({ message: 'Access Denied!' })
        }
    }).catch(error => res.status(500).send({ message: 'Internal Error', err: error }));
}

// Archive a selected product exclusive only for admin users
module.exports.archiveSelectedProduct = (req, res) => {
    const archive = ({
        isActive: false
    })
    
    // Validation for user if the login account is admin
    return User.findById(req.user.id).then(user => {
        if(user.isAdmin === true){
            return Product.findByIdAndUpdate(req.params.productId, archive).then((product, error) => {
                if(error){
                    return res.status(404).send({ message: 'Product is already archived'})
                } else {
                    return res.send({ message: 'Archive successful'})
                }
            })
        } else {
            return res.status(403).send({ message: 'Access Denied!' })
        }
    }).catch(error => res.status(500).send({ message: 'Internal Error', err: error }));
}

// Activates a selected product through its Id exclusive only for admin users
module.exports.activateSelectedProduct = (req, res) => {
    const activate = ({
        isActive: true
    });

    return User.findById(req.user.id).then(user => {
        if(user.isAdmin === true){
            return Product.findByIdAndUpdate(req.params.productId, activate).then((product, error) => {
                if(error){
                    return res.status(404).send({ message: 'Failed to activate'})
                } else {
                    return res.send({ message: 'Activate successful'})
                }
            })
        } else {
            return res.status(403).send({ message: 'Access Denied!' })
        }
    }).catch(error => res.status(500).send({ message: 'Internal Error', err: error }));

}