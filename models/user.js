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
    cityId:{
        type: String,
        required: false,
        default:''
    },
    stateId:{
        type: String,
        required: false,
        default:''
    },
    stateName:{
        type: String,
        required: false,
        default:''
    },
    
    cityName:{
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
    payment:{
        type: Boolean,
        required: false,
        default:'false'
    },
    sub_left_day:{
        type: Number,
        required: false,
        default: '1826'
    },
    yesterday:{
        type: String,
        required: false
    },
  
    postCount:{
        type: Number,
        required: false,
        default: '0'
    },
    receiptId:{
        type: String,
        required: false,
        default:''
    },
    liked_post_id: {
            type: Array,
            required: false,
        },
    notification:[
        {
            noti_id:{   type:mongoose.ObjectId},
            product_id:{ type:String, required: false},
            title:{  type:String, required: false}, 
            description:{type:String, required: false},
            created_on:{type:String, required: false}
        }
    ],
    fcmToken:{
        type: String,
        required: false,
        default:''
    }
    
})


module.exports = mongoose.model('user',userSchema,'user');