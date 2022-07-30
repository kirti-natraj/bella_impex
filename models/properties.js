const mongoose = require('mongoose');
const propertiesSchema = new mongoose.Schema({
    pro_id: {
        type: mongoose.ObjectId,
    },
    user_id: {
        type: String,
        required: false,
        default: 'Admin'
    },
    listed_by:{
        type: String,
        required: false,
        default: 'Admin'
    },
    category: {
        type: String,
        required: false,
        default:'Properties'
    },
    subcategory: {
        type: String,
        required: false,
        default:'Flats'
    },
    image: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false,
        default:'Flats on sale. 50% Lower Price than market price.'
        
    },
    price: {
        type: String,
        required: false,
        default:'30,000'
       
    },
    type:{
        type: String,
        required: false,
        default:'Flat'
    },
    bedroom:{
        type: String,
        required: false,
        default:'3'
    },
    bathroom:{
        type: String,
        required: false,
        default:'2'
    },
    furnishing:{
        type: Boolean,
        required: false,
        default: true
    },
    construction:{
        type: String,
        required: false
    },
    owner:{
        type: String,
        required: false,
        default:'Owner'
    },
    area:{
        type: String,
        required: false,
        default:'1000 sq ft'
    },
    carpet_area:{
        type: String,
        required: false,
        default:'1000 sq ft'
    },
    facing:{
        type: String,
        required: false,
        default:'North'
    },
    title: {
        type: String,
        required: false,
        default: 'Flat on sale'
    },
    date: {
        type: String,
        required: false,
        default: Date.now()

    },
    status: {
        type: Boolean,
        required: false,
        default: false
    },
    sold: {
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
    }

})

module.exports = mongoose.model('properties', propertiesSchema, 'properties');