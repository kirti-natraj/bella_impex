const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
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
    image: {
        type: String,
        required: false
    },
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
        type: String,
        required: false,
        default: Date.now()

    },
    year:{
        type: String,
        required: false
    },
    fuel:{
        type: String,
        required: false
    },
    km:{
        type: String,
        required: false
    },
    owner:{
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        required: false,
        default: false
    }

})

module.exports = mongoose.model('vehicle', vehicleSchema, 'vehicle');