const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    follow_id:{
        type:mongoose.ObjectId,
    },
   
    myUserId:{
        type: String,
        required: false,

    },
    otherUserId:{
        type: String,
        required: false,

    },
    created_on:{
        type: Date,
        required: false,
       default: Date.now()

    },
})

module.exports = mongoose.model('block',followSchema,'block');
