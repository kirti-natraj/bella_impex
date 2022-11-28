const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    follow_id:{
        type:mongoose.ObjectId,
    },
   
    groupId:{
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

module.exports = mongoose.model('followGroup',followSchema,'followGroup');
