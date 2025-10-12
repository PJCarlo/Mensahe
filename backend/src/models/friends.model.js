import mongoose from "mongoose";

const mongooseSchema = new mongoose.Schema({
    name: String,
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    friendRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    
}, 
{ timestamps: true });

const MongooseModel = mongoose.model("MongooseModel", mongooseSchema);

export default MongooseModel;
