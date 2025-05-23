import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_EXPIRY, JWT_REFRESH_EXPIRY, JWT_SECRET } from "../config/env.js";
import Token from "../models/token.model.js";

// Controller to sign-up an user
export const signUp = async(req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Create a new user
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ "email": email })
        if(existingUser){
            const error = new Error("User already exists. Please sign in.");
            error.statusCode = 409;
            throw error;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create([
            { username, email, password: hashedPassword}
        ], { session });

        const accessToken = jwt.sign( { userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRY });
        const refreshToken = jwt.sign( { userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRY });

        // Save refresh token to database
        await Token.create([{
            user: newUser[0]._id,
            token: refreshToken,
            isRevoked: false,
        }], { session });

        res.status(201).json({
            success: true,
            message: 'User created',
            data: {
                accessToken,
                refreshToken,
                user: newUser[0],
            }
        })

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

// Controller to sign-in an user
export const signIn = async(req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ "email": email });

        if(!user) {
            const error = new Error("User not found")
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
             const error = new Error("Incorrect password!")
            error.statusCode = 401;
            throw error;
        }

         const accessToken = jwt.sign( { userId: user._id }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRY });
         const refreshToken = jwt.sign( { userId: user._id }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRY });

        // Check if token exists, update if it does, create if it doesn't
        const existingToken = await Token.findOne({ user: user._id });
        if (existingToken) {
            await Token.updateOne(
            { user: user._id },
            { token: refreshToken, isRevoked: false },
            { session }
            );
        } else {
            await Token.create([{
            user: user._id,
            token: refreshToken,
            isRevoked: false,
            }], { session });
        }

         res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                accessToken,
                refreshToken,
                user,
            }
         })
         await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

// Controller to sign-out an user
export const signOut = async(req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Delete refresh token from database
        const { refreshToken } = req.body;
        if(!refreshToken) {
            const error = new Error("Refresh token is required");
            error.statusCode = 400;
            throw error;
        }

        const token = await Token.findOne({ token: refreshToken });
        if(!token) {
            const error = new Error("Token not found");
            error.statusCode = 404;
            throw error;
        }

        // Delete token
        await Token.deleteOne({ token: refreshToken }, { session });
        res.status(200).json({
            success: true,
            message: "User signed out successfully",
        })
        
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

// Controller to refresh user access token
export const refreshAccessToken = async(req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const token = await Token.findOne({ token: refreshToken });
        if(!token) {
            const error = new Error("Token not found");
            error.statusCode = 404;
            throw error;
        }

        // Check if token is revoked
        if(token.isRevoked) {
            const error = new Error("Token is revoked");
            error.statusCode = 401;
            throw error;
        }

        // Verify refresh token
        const decoded = jwt.verify(token.token, JWT_SECRET);
        if(!decoded) {
            const error = new Error("Invalid token");
            error.statusCode = 401;
            throw error;
        }

        // Generate new access token
        const accessToken = jwt.sign( { userId: decoded.userId }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRY });

        // Respond with new access token
        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: {
                accessToken,
            }
        })
        
        
    } catch (error) {
        next(error);
    }
}