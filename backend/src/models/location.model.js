import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true, 
    unique: true  
  },
  coordinates: {
    latitude: { 
        type: Number, 
        required: true 
    },
    longitude: { 
        type: Number, 
        required: true 
    }
  },
  address: { 
    type: String, 
    default: "" 
  },
  isSharing: { 
    type: Boolean, 
    default: true 
  },
}, 
{ timestamps: true });

const Location = mongoose.model("Location", locationSchema);

export default Location;
