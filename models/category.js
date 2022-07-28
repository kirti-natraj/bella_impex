const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    cat_id:{
        type:mongoose.ObjectId,
    },
   
    category_id:{
        type: String,
        required: false,

    },
    category_name:{
        type: String,
        required: false,

    },
    image:{
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

module.exports = mongoose.model('category',categorySchema,'category');
