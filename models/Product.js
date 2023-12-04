// Dependencies
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Name is required']
    },
    description : {
        type: String,
        required: [true, 'Description is required']
    },
    imgUrl : {
        type: String,
        required: [false, 'imgUrl not necessarily required']
    },
    price : {
        type: Number,
        required: [true, 'Name is required']
    },
    isActive : {
        type: Boolean,
        default: true
    },
    createdOn : {
        type: Date,
        default: new Date()
    },
    userOrders : [
        {
            userId : {
                type: String,
                required: [true, 'UserId is required']
            },
            orderId : {
                type: String,
                required: [true, 'OrderId is required']
            }
        }
    ]
})

module.exports = mongoose.model('Product', productSchema)