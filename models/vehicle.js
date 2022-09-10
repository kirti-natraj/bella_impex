const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
    pro_id: {
        type: mongoose.ObjectId,
    },
    user_id: {
        type: String,
        required: false
    },
    user_name:{
        type: String,
        required: false,
        default:''
    },
    user_image:{
        type: String,
        required: false,
        default:''
    },
    user_mobile:{
        type: String,
        required: false,
        default:''
    },
    since:{
        type: String,
        required: false,
        default:''
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
    created_on: {
        type: String,
        required: false
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
     
    latitude: {
        type: String,
        required: false
    },
     
    longitude: {
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
    approval:{
        type: Boolean,
        required: false,
        default: false
    },
    reject:{
        type: Boolean,
        required: false,
        default: false
    },
    like_count:{
        type: Number,
        required: false,
        default: 0
    },
    approved_on:{
        type: String,
        required: false,
        default:""
    },
    view_count:{
        type: Number,
        required: false,
        default: 0
    },
    viewer_id:{
        type: Array,
        required: false
    }
    

})

module.exports = mongoose.model('vehicle', vehicleSchema, 'vehicle');