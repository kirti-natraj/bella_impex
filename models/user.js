const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.ObjectId,
    },
    user_name:{
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
    status:{
        type: Boolean,
        required: false,
        default: true
    },
    
})

module.exports = mongoose.model('user',userSchema,'user');