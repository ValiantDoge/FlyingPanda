import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    isRevoked: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Token = mongoose.model("Token", tokenSchema);
export default Token;