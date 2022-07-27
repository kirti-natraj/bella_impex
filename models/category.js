const mongoose = require('mongoose');

let counter = 1;
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
    category_desc:{
        type: String,
        required: false,

    },
    created_on:{
        type: Date,
        required: false,
       

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
const Model =mongoose.model('category',categorySchema,'category');
Model.find({ id: { $gt: 0 } }).sort({ id: -1 })
    .then(([first, ...others]) => {
        if (first)
            counter = first.id + 1;
    });