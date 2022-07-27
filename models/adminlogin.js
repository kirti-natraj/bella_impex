const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
   
   
    username: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },

});
adminSchema.set('timestamps', true);

module.exports = mongoose.model('admin',adminSchema,'admin');