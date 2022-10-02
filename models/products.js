const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
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
        default: ''
    },
    subcategory: {
        type: String,
        required: false
    },
    image: {
        type: Array,
        required: false
    },

    description: {
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
    
    status: {
        type: Boolean,
        required: false,
        default: false
    },
    state: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    extra_data:{
        type:Array
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
    },
    likeFlag:{
        type: Boolean,
        required: false,
        default: false
    }
    

})

module.exports = mongoose.model('product', productSchema, 'product');