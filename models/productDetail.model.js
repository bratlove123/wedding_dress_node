const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProductDetailSchema = new Schema({
    typeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Type"
    },
    colorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Color"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    sizes: [
        { 
            type: Schema.Types.ObjectId, 
            ref: 'ProductSize' 
        }
    ],
    images: [
        { 
            type: String
        }
    ],
    price: {type: Number, required: true},
    ogPrice: {type: Number, required: true},
    whPrice: {type: Number, required: true},
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
module.exports = mongoose.model('ProductDetail', ProductDetailSchema);