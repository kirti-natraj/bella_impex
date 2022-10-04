const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
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
    likeCount:{
        type: Number,
        default: 0
    },
    created_on:{
        type: Date,
        required: false,
       default: Date.now()

    },
})

module.exports = mongoose.model('likePost',likeSchema,'likePost');
