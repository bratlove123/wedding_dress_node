const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LeftNavItemSchema = new Schema({
    name: {type: String, required: true},
    url: {type: String, required: true},
    leftNavId: {
        type: Schema.Types.ObjectId,
        ref: 'LeftNav',
        required: true
    },
    position: {type: Number},
    createdOn: {
        type: Date,
        default: Date.now
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
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

module.exports = mongoose.model('LeftNavItem', LeftNavItemSchema);