const mongoose = require('mongoose');

const notiSchema = new mongoose.Schema({
    noti_id:{
        type:mongoose.ObjectId,
    },
    user:{
        type: String,
        required: false,

    },
    title:{
        type: String,
        required: false,

    },
    msg:{
        type: Date,
        required: false,
       default: Date.now()

    },
    status:{
        type: Boolean,
        required: false,
        default: true
    },
})

module.exports = mongoose.model('noti',notiSchema,'noti');
