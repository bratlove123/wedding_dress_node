const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProductSchema = new Schema({
    code: {type: String, required: true, max: 10},
    name: {type: String, required: true, max: 100},
    des: {type: String},
    lookAfter: {type: String},
    brand: {type: String},
    typeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Type"
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier"
    },
    details: [
        { 
            type: Schema.Types.ObjectId, 
            ref: 'ProductDetail' 
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

// Export the model
module.exports = mongoose.model('Product', ProductSchema);