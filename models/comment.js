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
    likeCount:{
        type: Number,
        required: false,
        default: 0

    },
    created_on:{
        type: Date,
        required: false,
       default: Date.now()

    },
    ago:{
        type: String,
        required: false,
        default: '1 hr'
    },
  
})

module.exports = mongoose.model('commentPost',commentSchema,'comentPost');
