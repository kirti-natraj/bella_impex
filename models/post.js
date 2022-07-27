const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    pro_id: {
        type: mongoose.ObjectId,
    },
    user_id: {
        type: String,
        required: false
    },
    prod_category: {
        type: String,
        required: false
    },
    prod_sub_category: {
        type: String,
        required: false
    },
    prod_image: {
        type: String,
        required: false
    },
    prod_description: {
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

    },
    status: {
        type: Boolean,
        required: false,
        default: false
    }

})

module.exports = mongoose.model('post', postSchema, 'post');