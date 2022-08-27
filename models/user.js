const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.ObjectId,
    },
    name:{
        type: String,
        required: false,
        default:''
    },
    user_name:{
        type: String,
        required: false,
        default:''
    },
    image:{
        type: String,
        required: false,
        default:''
    },
    district:{
        type: String,
        required: false,
        default:''
    },
    address:{
        type: String,
        required: false,
        default:''
    },
    mobile:{
        type: String,
        required: false,
        default:''
      
    },
    email:{
        type: String,
        required: false,
        default:''
      
    },
    user_type:{
        type: String,
        required: false,
        default:''
        
    },
    about_business:{
        type: String,
        required: false,
        default:''
        
    },
    birthdate:{
        type: String,
        required: false,
        default:''
       
    },
    whatsapp:{
        type: Boolean,
        required: false,
        default:'false'
       
    },
    toThisNoReach:{
        type: Boolean,
        required: false,
        default:'false'
       
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