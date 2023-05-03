import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
              return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(v);
            },
            message: (props) => `Enter a valid ${props.path} address!`,
            message: (props) => `Email has to be ${props.path} address!`,
          },
          unique: true,
        
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: { type: String,
         required: true
     },
    phoneNumber: {
      type: String,
      required: true,
      unique: false,
      validate: {
        validator: function (v) {
          return /^(\+|00)[0-9]{1,3}[0-9]{7,14}(?:x.+)?$/.test(v);
        },
        message: (props) =>
          `${props.path} should be atleast (8)characters! & should contain a country code`,
      },
      minLength: 8,
      maxLength: 14,
    },
    _id: mongoose.Schema.Types.ObjectId,
  
});

const User = mongoose.model("User", UserSchema);

export default User;