const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TypeSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    sizes: [
        { 
            type: Schema.Types.ObjectId, 
            ref: 'Size' 
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

module.exports = mongoose.model('Type', TypeSchema);
