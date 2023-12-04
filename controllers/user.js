// Dependencies and Module
const User = require('../models/User');
const Product = require('../models/Product')
const bcrypt = require('bcrypt');
const auth = require('../authorization')


// User Registration 
module.exports.userRegistration = async (reqBody) => {
  try {
    const existingUser = await User.findOne({ email: reqBody.email });

    if (existingUser) {
      return { message: 'User already exists' };
    }

    const newUser = new User({
      firstName: reqBody.firstName,
      lastName: reqBody.lastName,
      mobileNumber: reqBody.mobileNumber,
      email: reqBody.email,
      password: bcrypt.hashSync(reqBody.password, 10),
    });

    const savedUser = await newUser.save();

    if (savedUser) {
      return { message: 'User successfully created!' };
    } else {
      return { message: 'Failed creating an account' };
    }
  } catch (error) {
    console.error('Error during user registration:', error);
    return { message: 'An error occurred during registration. Please try again.' };
  }
};


// User Login and Authentication
module.exports.userLogin = (req, res) => {
    const { email, password } = req.body;

    return User.findOne({ email }).then(user => {
        if(user === null) {
            return res.send(false);
        } else {
            const isPasswordCorrect = bcrypt.compareSync(password, user.password);

            if(isPasswordCorrect) {
                return res.send({ access: auth.createAccessToken(user) })
            } else {
                return  res.send(false)
            }
        }
        // if(user !== null){
        //     const isPasswordCorrect = bcrypt.compareSync(password, user.password);

        //     if(isPasswordCorrect){
        //         const accessToken = auth.createAccessToken(user);

        //         if(accessToken){
        //             return res.send({ accessToken });
        //         } else {
        //             return res.status(400).send('Failed to generate access token')
        //         }

        //     } else {
        //         return res.status(401).send('Wrong credentials')
        //     }
        // } else {
        //     return res.status(404).send('User does not exist');
        // }
    }).catch(err => res.send(err))
    
}

// Non admin user checkout
module.exports.createOrder = async (req, res) => {
    
    try {
        const userId = req.user.id;
        const { productId, productName, quantity } = req.body;

        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        if(req.user.isAdmin){
            return res.status(404).send({ message: 'Invalid credentials' });
        }

        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }

        const totalAmount = product.price * quantity

        const order = {
            products : [
                {
                    productId: productId,
                    productName: productName,
                    quantity : quantity
                }
            ],
            totalAmount
        }

        user.orderedProduct.push(order);

        
        const savedUser = await user.save();

        const orderId = savedUser.orderedProduct[0]._id;

        const updateProduct = await Product.findById(productId);

        if (!updateProduct) {
            return res.status(404).send({ message: 'Product not found' });
        }

        const customerOrder = {
            userId,
            orderId,
        };

        updateProduct.userOrders.push(customerOrder);

        await updateProduct.save();

        res.send({
            message: 'Purchase successfully!',
            details: savedUser.orderedProduct,
            orderId,
        }); 

    } catch(error){
        console.error(error)
        res.status(500).send({ message: 'Internal Server Error' });
    }

}

// Retrieve User details to get the users details
module.exports.showDetails = (req, res) => {
    
    return User.findById(req.user.id).then(user => {
        user.password = '';
        if(user){
            return res.send({ message: 'Your user profile', details: user })
        } else {
            return res.status(403).send({ message: 'User does not exist'})
        }
    })
}

// Set non-admin user into admin user
module.exports.setAsAdmin = async (req, res) => {
    try {
        const { userId } = req.body;

        const update = ({
            isAdmin: true
        });

        const user = await User.findByIdAndUpdate(userId, update);

        if(!user){
            return res.status(403).send({ message: 'User not exist'}) 
        }

        if(user.isAdmin === true){
            return res.status(403).send({ message: 'Already an admin account'})
        }

        res.status(200).json({ message: "User updated as admin successfully", user });

    }catch (error){
        res.status(500).send({ message: 'Internal Server Error', details: error });
    }
}

// Retrieves all order of a user
module.exports.getAllOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if(!user){
            return res.status(403).send({ message: 'User not exist'})
        }

        if(user.isAdmin === false){
            return res.status(403).send({ message: 'Need an admin account'})
        }
    
        const userWithOrder = await User.find({'orderedProduct.0' : { $exists: true } }).select('firstName lastName orderedProduct') 

        res.send({ message: 'User with Orders', details: userWithOrder})

    }catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Retrieves User's order 
module.exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if(!user){
            return res.status(403).send({ message: 'User not exist'})
        }

        if(user.isAdmin === true){
            return res.status(403).send({ message: 'Invalid credentials'})
        }
    
        const userWithOrders = await User.findById(userId).select('orderedProduct')

        if(!userWithOrders){
            return res.status(404).json({ error: 'User not found' });
        }

        res.send({ message: 'Here is the list of your orders', details: userWithOrders})

    }catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

