const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    like_id:{
        type:mongoose.ObjectId,
    },
    userId:{
        type: String,
        required: false,

    },
    postId:{
        type: String,
        required: false,

    },
    comment:{
        type: String,
        required: false,

    },
    created_on:{
        type: Date,
        required: false,
       default: Date.now()

    },
})

module.exports = mongoose.model('commentPost',commentSchema,'comentPost');
