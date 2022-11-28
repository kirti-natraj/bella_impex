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
        type: Array,
        required: false,

    },
    created_on:{
        type: Date,
        required: false,
       default: Date.now()
    },
})

module.exports = mongoose.model('suggestionFriendList',followSchema,'suggestionFriendList');
