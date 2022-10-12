const mongoose = require('mongoose');

const feedStorySchema = new mongoose.Schema({
    feed_id:{
        type:mongoose.ObjectId,
    },
    userId:{
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
    url:{
        type: String,
        required: false,
        default: ''

    },
    about:{
        type: String,
        required: false,
        default: ''
    },
   
    viewUser:{
        type: Array,
        required: false,
      
    },
    ago:{
        type: String,
        required: false,
        default: '1 hr'
    },
   
    
})

module.exports = mongoose.model('feedStory',feedStorySchema,'feedStory');
