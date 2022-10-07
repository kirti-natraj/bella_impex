const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment_id:{
        type:mongoose.ObjectId,
    },
    userId:{
        type: String,
        required: false,

    },
    userName:{
        type: String,
        required: false,

    },
    userImage:{
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
    commentArray:{
        type: Array,
        required: false,
        default:[]
    },
    created_on:{
        type: Date,
        required: false,
       default: Date.now()

    },
  
})

module.exports = mongoose.model('commentPost',commentSchema,'comentPost');
