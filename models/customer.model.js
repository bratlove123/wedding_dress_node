const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let CustomerSchema = new Schema({
  name: { type: String, required: true },
  email: {type: String},
  birthday: {type: Date},
  sex: {type:Boolean},
  address: { type: String },
  phone: { type: String },
  facebook: { type: String },
  image: {type:String},
  point: {type:Number},
  customerGroupId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CustomerGroup'
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
    ref: "User"
  }
});

// Export the model
module.exports = mongoose.model("Customer", CustomerSchema);