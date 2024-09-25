import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from 'express-validator';
import mongoose from "mongoose";

const signup = async (req, res, next) => {
    try {
        // Validate input
        await body('email').isEmail().normalizeEmail().run(req);
        await body('password').isLength({ min: 6 }).run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists", status: 400 });
        }

        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const newUser = await User.create({
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { _id: newUser._id, first_name: newUser.first_name, last_name: newUser.last_name, email: newUser.email },
            process.env.JWT_SECRET || "defaultsecret",
            { expiresIn: "90d" }
        );

        res.status(201).json({
            status: 201,
            message: "User registered successfully",
            token,
            user: {
                _id: newUser._id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found!",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || "defaultsecret", {
            expiresIn: "90d",
        });

        res.status(200).json({
            status: 200,
            message: "Logged in successfully.",
            token,
            user: {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error); // Forward error to the error handler
    }
};

export { signup, login };