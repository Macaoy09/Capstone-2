// Dependencies
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: [true, 'Firstname is required']
    },
    lastName : {
        type: String,
        required: [true, 'Lastname is required']
    },
    mobileNumber : {
        type: String,
        required: [true, 'MobileNumber is required']
    },
    email : {
        type: String,
        required: [true, 'Email is required']
    },
    password : {
        type: String,
        required: [true, 'Password is required']
    },
    isAdmin : {
        type: Boolean,
        default: false
    },
    orderedProduct : [
        {
            products : [
                {
                    productId : {
                        type: String,
                        required: [true, 'ProductId is required']
                    },
                    productName : {
                        type: String,
                        required: [true, 'ProductName is required']
                    },
                    quantity : {
                        type: Number,
                        required: [true, 'Quantity is required']
                    }  
                }
            ],
            totalAmount : {
                type: Number,
                required: [true, 'TotalAmount is required']
            },
            purchasedOn  : {
                type: Date,
                default: new Date()
            }
        }
    ]
})
module.exports = mongoose.model('User', userSchema);