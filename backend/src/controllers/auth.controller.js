import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async(req, res) => {
    const { firstName, lastName, mobile, birthdate, email, password } = req.body;
    try {

        { /* Validate input notice if fields is empty */ }
        if (!firstName || !lastName || !mobile || !birthdate || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        } 
        
        { /* validate password the password must atleaset 8 character length or more */ }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        { /* Check if user already exists */ }
        const user = await User.findOne({ mobile, email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name: {
                firstName,
                lastName
            },
            mobile,
            birthdate,
            email,
            password: hashedPassword,
            profilePicture: ""
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                message: "Account created successfully",
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    mobile: newUser.mobile,
                    birthdate: newUser.birthdate,
                    email: newUser.email,
                    profilePicture: newUser.profilePicture
                }
            });
        } else {
            res.status(500).json({ message: "Failed to create account" });
        }

    } catch (error) {
        console.error("Error in signup controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = (req, res) => {
  res.send("login route");
};

export const logout = (req, res) => {
  res.send("logout route");
};
