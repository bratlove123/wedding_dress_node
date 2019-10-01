const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let OrderSchema = new Schema({
  code: { type: String, required: true },
  customerId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer"
   },
   orders: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderDetail"
   }],
  customerCost: { type: Number },
  customerDiscount: { type: Number },
  birthdayDiscount: { type: Number },
  plusDiscount: { type: Number },
  payPrice: { type: Number },
  totalPrice: { type: Number },
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
module.exports = mongoose.model("Order", OrderSchema);
