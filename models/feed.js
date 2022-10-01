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
    feeling:{
        type: String,
        required: false,
        default: ''
    },
    activity:{
        type: String,
        required: false,
        default: ''
    },
    tagPeople:{
        type: String,
        required: false,
        default: ''
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
    commentArray:[{  
        userName:String,
        userImage: String,
        comment: String
    }],
    ago:{
        type: String,
        required: false,
        default: '1 hr'
    },
        
    
})

module.exports = mongoose.model('feed',feedSchema,'feed');
