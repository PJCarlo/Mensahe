import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    firstName: { 
        type: String, 
        required: true 
    },

    lastName:  { 
        type: String, 
        required: true 
    }
  },

  mobile:   { 
    type: String, 
    required: true, 
    unique: true 
  },

  email:    { 
    type: String, 
    required: true, 
    unique: true 
  },

  password: { 
    type: String, 
    required: true, 
    minlength: 8 
  }, 

  profilePicture: { 
    type: String, 
    default: "" 
  }

}, 

{ timestamps: true });

const Auth = mongoose.model("User", userSchema);

export default Auth;
