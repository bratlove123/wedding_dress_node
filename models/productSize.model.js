const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProductSizeSchema = new Schema({
    productDetailId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductDetail"
    },
    sizeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Size"
    },
    quantity: {type: Number, required: true},
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
module.exports = mongoose.model('ProductSize', ProductSizeSchema);