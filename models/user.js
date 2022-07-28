const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.ObjectId,
    },
    password:{
        type: String,
        required: false,
        default:'123'
    },
    user_name:{
        type: String,
        required: false
    },
    image:{
        type: String,
        required: false
    },
    district:{
        type: String,
        required: false
    },
    city:{
        type: String,
        required: false
    },
    mobile:{
        type: String,
        required: false,
        default: ''
    },
    email:{
        type: String,
        required: false,
        default: ''
    },
    birthdate:{
        type: String,
        required: false,
        default: ''
    },
    buy_sell:{
        type: Boolean,
        required: false,
        default: true
    },
    reach:{
        type: Boolean,
        required: false,
        default: true
    },
    status:{
        type: Boolean,
        required: false,
        default: true
    },
    added_on:{
        type: Date,
        required: false,
        default: Date.now()
    },
    
})

module.exports = mongoose.model('user',userSchema,'user');