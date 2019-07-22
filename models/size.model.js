const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SizeSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    typeId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Type'
    },
    modifiedOn: {
        type: Date,
        default: Date.now
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
});

module.exports = mongoose.model('Size', SizeSchema);
