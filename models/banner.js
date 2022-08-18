const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    banner_id:{
        type:mongoose.ObjectId,
    },
    image:{
        type: String,
        required: false,

    },
    created_on:{
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

module.exports = mongoose.model('banner',bannerSchema,'banner');
