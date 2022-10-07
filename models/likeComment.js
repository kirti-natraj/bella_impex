const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment_id:{
        type:mongoose.ObjectId,
    },
   
    userId:{
        type: String,
        required: false,

    },
    commentId:{
        type: String,
        required: false,

    },
    created_on:{
        type: Date,
        required: false,
       default: Date.now()

    },
})

module.exports = mongoose.model('likeComment',commentSchema,'likeComment');
