const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SupplierSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String
    },
    image: {
        type: String
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    facebook: {
        type: String
    },
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

module.exports = mongoose.model('Supplier', SupplierSchema);
