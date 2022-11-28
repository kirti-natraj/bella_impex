const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    sub_id:{
        type:mongoose.ObjectId,
    },
  
    subscription_name:{
        type: String,
        required: false,

    },
    description:{
        type: String,
        required: false,

    },
    duration:{
        type: Number,
        required: false,
        default: 0
    },
    gst:{
        type: Number,
        required: false,
        default: 18
    },
    total:{
        type: Number,
        required: false,
        default: 0
    },
    amount:{
        type: Number,
        required: false,
        default: 0
    },
    created_on:{
        type: Date,
        required: false,
       default: Date.now()

    },
    created_by:{
        type: String,
        required: false,
        default: 'Admin'

    },
    status:{
        type: Boolean,
        required: false,
        default: true
    },
})

module.exports = mongoose.model('subscription',subscriptionSchema,'subscription');
