const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let OrderDetailSchema = new Schema({
  order_id: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
   },
   product_id: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
   },
   size_id: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Size"
   },
   color_id: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Color"
   },
  price: { type: Number },
  quantity: { type: Number },
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
    ref: "User"
  }
});

// Export the model
module.exports = mongoose.model("OrderDetail", OrderDetailSchema);
