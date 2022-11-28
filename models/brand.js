const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    brand_id:{
        type:mongoose.ObjectId,
    },
   
    brand_name:{
        type: String,
        required: false,

    },
    image:{
        type: String,
        required: false,

    },
    categoryId:{
        type: String,
        required: false,

    },
    created_on:{
        type: Date,
        required: false,
       default: Date.now()

    },
    created_by:{
        type: String,
        required: false,
        default: 'Admin'

    },
    status:{
        type: Boolean,
        required: false,
        default: true
    },
})

module.exports = mongoose.model('brand',brandSchema,'brand');
