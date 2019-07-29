const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleGroupSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    code: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    childs: [
        { 
            type: Schema.Types.ObjectId, 
            ref: 'Role' 
        }
    ],
    createdOn: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
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

module.exports = mongoose.model('RoleGroup', RoleGroupSchema);
