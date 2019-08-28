const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let CustomerGroupSchema = new Schema({
  title: { type: String, required: true },
  level: {type: Number, required: true},
  targetPoint: {type:Number, required: true},
  minMoney: { type: Number, required: true},
  discount: { type: Number, required: true },
  image: { type: String },
  description: {type:String},
  customers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer'
  }],
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
module.exports = mongoose.model("CustomerGroup", CustomerGroupSchema);