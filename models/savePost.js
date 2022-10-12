const mongoose = require('mongoose');

const saveSchema = new mongoose.Schema({
    comment_id:{
        type:mongoose.ObjectId,
    },
    userId:{
        type: Array,
        required: false,

    },
    postId:{
        type: String,
        required: false,

    },
   
  
})

module.exports = mongoose.model('savePost',saveSchema,'savePost');
