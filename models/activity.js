const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    activity_id:{
        type:mongoose.ObjectId,
    },
  
   name:{
        type: String,
        required: false,

    },
    image:{
        type: String,
        required: false,

    },
    type:{
        type: String,
        required: false,

    },
    
})

module.exports = mongoose.model('activity',activitySchema,'activity');
