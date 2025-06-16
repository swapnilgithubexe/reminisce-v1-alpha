import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    // ! Runtime / Request-Level Validation
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (password.length < 10) {
      return res.status(400).json({
        message: "Password must be at least 10 characters long!",
      });
      // ! Following the industry norms for pass length
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });


    if (existingUser) {
      return res.status(400).json({
        message: "Email already in use!",
      });
    }

    const randomNum = Math.floor(Math.random() * 100) + 1; //to generate random number from 1-100 for avatar building

    const randomAvatar = `https://avatar.iran.liara.run/public/${randomNum}.png`;

    const newUser = new User({
      fullName,
      email,
      password,
      profilePic: randomAvatar,
    });

    await newUser.save();

    // TODO : create a stream auth for each user.

    //token with userId as payload
    const token = jwt.sign(
      {
        userId: newUser._id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    //cookie config
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, //for XSS attacks
      sameSite: "strict", //for CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    //resource created
    res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.log("Dev Mode-> Debug-> Error in the sign up controller function");
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
