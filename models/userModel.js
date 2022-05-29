const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const createError = require("http-errors");

const UserSchema = new Schema(
  {
    isim: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    sifre: {
      type: String,
      required: true,
      trim: true,
    },
    isAdmin:{
      type: Boolean,
      default: false
    }
  },
  { collection: "kullanicilar", timestamps: true }
);

const schema = Joi.object({
  isim: Joi.string().min(3).max(50).trim(),
  userName: Joi.string().min(3).max(50).trim(),
  email: Joi.string().email().trim(),
  sifre: Joi.string().trim(),
});

UserSchema.methods.joiValidation = function (userObject) {
  schema.required();
  return schema.validate(userObject);
};

UserSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user._id
  delete user.sifre
  delete user.createdAt
  delete user.updatedAt
  delete user.__v
  return user

}

UserSchema.statics.girisYap = async (email,sifre)=>{

        const user = await User.findOne({email})

        const {error,value} =schema.validate({email,sifre})
        
        if (error) {
          throw createError(400,error)
          
        }
        
        
        if (!user) {
          throw createError(400,"Girilen email/sifre hatalı")

        }

        const sifreKontrol = await bcrypt.compare(sifre, user.sifre)

          if (!sifreKontrol) {
            throw createError(400,"Girilen email/sifre hatalı")

          }

          return user;

}


UserSchema.methods.generateToken = function () {
  const girisYapanUser = this
  const token = jwt.sign({_id:girisYapanUser._id},"secretkey",{expiresIn:"1h"})
  return token 
}


UserSchema.statics.joiValidationForUpdate = function (userObject) {
  return schema.validate(userObject);
};  

const User = mongoose.model("User", UserSchema);

module.exports = User;
