import Token from "../models/token.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getUsers  = async (req, res, next) => {
    try {
        const users = await User.find({}, '-password -__v');
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        next(error);
    }
}

export const getUser  = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password -__v');
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

export const updateUser = async(req, res, next) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const user = await User.findById(req.params.id).select('-password -__v');
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const { username, email } = req.body;

        // Only update fields that are provided
        if (username) user.username = username;
        if (email){
            // Find if email already exists
            const existingUser = await User.findOne({ email }).session(session);
            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                const error = new Error("Email already exists");
                error.statusCode = 400;
                throw error;
            }
            user.email = email;
        }

        await user.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User Updated',
            data: user,
        });
       
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const userId = req.params.id;

        const user = await User.findById(userId).session(session).select('-password -__v');
       if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        await Token.deleteMany({ userId }, { session });

        // Delete the user
        await User.findByIdAndDelete(userId, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: user
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};
