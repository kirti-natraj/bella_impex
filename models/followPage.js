const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    follow_id:{
        type:mongoose.ObjectId,
    },
   
    pageId:{
        type: String,
        required: false,

    },
    otherUserId:{
        type: String,
        required: false,

    },
    indicator:{
        type: String,
        required: false,
        default: 'default'
    },
    created_on:{
        type: Date,
        required: false,
       default: Date.now()

    },
})

module.exports = mongoose.model('followPage',followSchema,'followPage');
