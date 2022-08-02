const mongoose = require('mongoose');

const yearSchema = new mongoose.Schema({
    year_id:{
        type:mongoose.ObjectId,
    },
   
    year:{
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

module.exports = mongoose.model('year',yearSchema,'year');
