const mongoose = require('mongoose');
const subcategorySchema = new mongoose.Schema({
   sub_id:{
        type:mongoose.ObjectId,
    },
    category_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: false,

    },
    sub_category_id:{
        type: String,
        required: false,

    },
    sub_category_name:{
        type: String,
        required: false,

    },
    created_on:{
        type: Date,
        required: false,

    },
    status:{
        type: Boolean,
        required: false,
        default: true
    },
  
})

module.exports = mongoose.model('subcategory',subcategorySchema,'subcategory');