import { generateTokenAndSetCookie } from "../lib/generateTokenAndSetCookie.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;

    // check input errors
    if (!username || !fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format!" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken!" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User email already exists!" });
    }

    if (username.length < 4)
      return res
        .status(400)
        .json({ error: "Username must be at least 4 character long." });

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // save user to db
    const newUser = new User({
      username,
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({ error: "Invalid user data!" });
    }
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    return res.status(500).json({ error: "Internal Server Error!" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || "",
    );
    if (!user || !isPasswordCorrect)
      return res.status(400).json({ error: "Invalid username or password!" });

    generateTokenAndSetCookie(user._id, res);

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log("Error in login controller: ", error.message);
    return res.status(500).json({ error: "Internal Server Error!" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt_token", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    return res.status(500).json({ error: "Internal Server Error!" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller:", error.message);
    return res.status(500).json({ error: "Internal Server Error!" });
  }
};
