const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.ObjectId,
    },
    name:{
        type: String,
        required: false
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
    address:{
        type: String,
        required: false
    },
    mobile:{
        type: String,
        required: false,
      
    },
    user_type:{
        type: String,
        required: false,
        
    },
    about_business:{
        type: String,
        required: false,
        
    },
    birthdate:{
        type: String,
        required: false,
       
    },
    buy_sell:{
        type: Boolean,
        required: false,
       
    },
    reach:{
        type: Boolean,
        required: false,
       
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