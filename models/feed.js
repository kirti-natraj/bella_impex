const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
    feed_id:{
        type:mongoose.ObjectId,
    },
    user_id:{
        type: String,
        required: false,
        default: ''
    },
    userName:{
        type: String,
        required: false,
        default: ''
    },
    userImage:{
        type: String,
        required: false,
        default: ''
    },
    type:{
        type: String,
        required: false,
        default: ''
    },
    url:{
        type: String,
        required: false,
        default: ''

    },
    location:{
        type: String,
        required: false,
        default: ''
    },
    activity:{
        type: Array
    },
    tag_people:{
       type: Array
    },
    about:{
        type: String,
        required: false,
        default: ''
    },
    likeCount:{
        type: String,
        required: false,
        default: '0'
    },
    ago:{
        type: String,
        required: false,
        default: '1 hr'
    },
    commentCount:{
        type: Number,
        required: false,
        default: 10
    },  
    ShareCount:{
        type: Number,
        required: false,
        default: 10
    },
    like:{
      type: Boolean,
      required: false,
      default: false
    },
    follow:{
        type: Boolean,
        required: false,
        default: false
      },
    
})

module.exports = mongoose.model('feed',feedSchema,'feed');
