const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    state_id:{
        type:mongoose.ObjectId,
    },
    state_name:{
        type: String,
        required: false,

    },

    
})
module.exports = mongoose.model('state',stateSchema,'state');
