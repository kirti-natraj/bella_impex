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
    added_by:{
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
    from:{
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
        type: Number,
        required: false,
        default: 0
    },
    ago:{
        type: String,
        required: false,
        default: '1 hr'
    },
    commentCount:{
        type: Number,
        required: false,
        default: 0
    },  
    ShareCount:{
        type: Number,
        required: false,
        default: 0
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
      created_on:{
        type: Number,
        required: false,
        default: 0
      },
      added_on:{
        type: String,
        required: false,
        default: '21St Oct 2022'
      }
    
})

module.exports = mongoose.model('feed',feedSchema,'feed');
