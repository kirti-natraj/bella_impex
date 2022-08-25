const mongoose = require('mongoose');
const otpSchema = new mongoose.Schema({
    otp_id:{
        type: mongoose.ObjectId,
        required: false
    },
     mobile_no:{
        type: String,
        required: false
    },
    otp:{
        type: String,
        required: false
    },
    expiration_time:{
        type:String,
        required: false
    }
});
module.exports = mongoose.model('otp',otpSchema,'otp');