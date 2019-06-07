const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LeftNavSchema = new Schema({
    name: {type: String, required: true},
    url: {type: String, required: true},
    iconClass: {type: String},
    isHasBadge: {type: Boolean},
    badgeClass: {type: String},
    badgeNumber: {type: Number},
    childs: [{ type: Schema.Types.ObjectId, ref: 'LeftNavItem' }],
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

// Export the model
module.exports = mongoose.model('LeftNav', LeftNavSchema);
