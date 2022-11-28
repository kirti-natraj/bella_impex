const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    invoice_id:{
        type:mongoose.ObjectId,
    },
  
    company_name:{
        type: String,
        required: false,

    },
    image:{
        type: String,
        required: false,

    },
    location:{
        type: String,
        required: false,
    
    },
    email:{
        type: String,
        required: false,
    
    },
    mobile:{
        type: String,
        required: false,
     

    }
})

module.exports = mongoose.model('adminInvoice',categorySchema,'admionInvoice');
