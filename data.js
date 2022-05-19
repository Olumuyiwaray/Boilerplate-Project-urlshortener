const mongoose = require('mongoose');

const Schema =  mongoose.Schema;

const dataSchema = new Schema({
    url: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Data = mongoose.model("Data", dataSchema);


module.exports = Data;
