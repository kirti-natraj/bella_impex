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
        required: false,
        default: 'Vehicles'
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
    insurance_type: {
        type: String,
        required: false
    },
    insurance_valid: {
        type: String,
        required: false
    },
    transmission: {
        type: String,
        required: false
    },

})

module.exports = mongoose.model('vehicle', vehicleSchema, 'vehicle');