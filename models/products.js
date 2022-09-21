const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    pro_id: {
        type: mongoose.ObjectId,
    },
    user_id: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    subcategory: {
        type: String,
        required: false
    },
    category_name: {
        type: String,
        required: false
    },
    subcategory_name: {
        type: String,
        required: false
    },
    image: [
        Object
    ],
    description: {
        type: String,
        required: false
        
    },
    brand:{
        type: String,
        required: false
    },
    price: {
        type: String,
        required: false
       
    },
    title: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: false,
        default: Date.now()
    },
    status: {
        type: Boolean,
        required: false,
        default: false
    },
        
    location: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    pin: {
        type: String,
        required: false
    },
    longitude: {
        type: String,
        required: false
    },
    latitude: {
        type: String,
        required: false
    },
    likeFlag:{
        type: Boolean,
        required: false,
        default: false
    }

})

module.exports = mongoose.model('product', productSchema, 'product');