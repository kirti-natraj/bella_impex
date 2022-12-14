const mongoose = require('mongoose');
const subcategorySchema = new mongoose.Schema({
   sub_id:{
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
    form_created:{
        type: Boolean,
        required: false,
        default: false
    },
    question:{
        type: Array,
        required:false,
    },
    dataType:{
        type: Array,
        required: false
    }
  
})

module.exports = mongoose.model('subcategory',subcategorySchema,'subcategory');