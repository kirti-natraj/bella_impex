const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
    project_id:{
        type:mongoose.ObjectId,
    },
    project_date:{
        type: String,
        required: false,
        default: new Date()
    },
    project_name:{
        type: String,
        required: false
    },
    start_date:{
        type: String,
        required: false,
        default:"not Entered"
    },
    end_date:{
        type: String,
        required: false,
        default:"not Entered"
    },
    client_name:{
        type: String,
        required: false
    },
    client_email:{
        type: String,
        required: false,

    },
    client_mobile:{
        type: String,
        required: false,

    },
    req_link:{
        type: String,
        required: false

    },
    module_link:{
        type: String,
        required: false

    },
    addi_point:{
        type: String,
        required: false,
        default: "NULL"
    },
    status_doc:{
        type: String,
        required: false,
    },
    progress:{
        type: String,
        required: false,
        default:"0"
    },
})

module.exports = mongoose.model('project',projectSchema,'project');