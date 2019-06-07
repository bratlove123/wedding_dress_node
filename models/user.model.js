const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds =10;
const common_func = require('../utils/common_func');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
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
    emailConfirmToken: {
        type:String,
        default: common_func.generateGuid()
    },
    isConfirmEmail: {
        type:Boolean,
        default: false
    },
    expiryTokenTime: {
        type:Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
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

UserSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

UserSchema.methods.isValidPassword= async function(password){
    const user=this;
    const compare=await bcrypt.compareSync(password, user.password);
    return compare;
}

UserSchema.methods.isConfirmedEmail=async function(){
    return this.isConfirmEmail;
}

module.exports = mongoose.model('User', UserSchema);