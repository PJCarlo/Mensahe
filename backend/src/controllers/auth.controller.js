import { generateTokens } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  const { firstName, lastName, mobile, email, gender, password } = req.body;

  try {
    if (!firstName || !lastName || !mobile || !email || !gender || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailpattern.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: { firstName, lastName },
      mobile,
      email,
      gender,
      password: hashedPassword,
      profilePicture: ""
    });

    await newUser.save();

    const savedUser = await User.save();
    generateTokens(savedUser._id, res);

    // Generate tokens + set cookies
    generateTokens(newUser, res);

    res.status(201).json({
      message: "Account Created!",
      user: {
        id: newUser._id,
        name: newUser.name,
        mobile: newUser.mobile,
        email: newUser.email,
        gender: newUser.gender,
        profilePicture: newUser.profilePicture
      }
    });

  } catch (error) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    generateTokens(user._id, res);

    res.status(200).json({
      message: "Login Success!",
      user: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        gender: user.gender,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.clearCookie("refresh");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {profilePicture} = req.body;
    const userID = req.user._id

    if(!profilePicture){
      return res.status(400).json({message: "Profile picture is required"})
    }

    const upcloudResponse = await cloudinary.uploader.upload(profilePicture);
    const updatedUser = await User.findByIdAndUpdate(userID, {profilePicture: upcloudResponse.secure_url}, {new: true});

    res.status(200).json({user: updatedUser});

  } catch (error) {
    console.error("Error in updateProfile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
