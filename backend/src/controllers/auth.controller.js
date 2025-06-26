import { upsertStreamUser } from "../lib/stream.js";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

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

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      logger.info(`Stream profile is created for ${newUser.fullName}`);
    } catch (error) {
      //TODO: logger.error should be in production only
      // logger.error(error.message)
      console.log(`Dev Mode -> Error upserting stream user: `, error.message);
    }

    //! token with userId as payload
    const token = jwt.sign(
      {
        userId: newUser._id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    //! cookie config
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, //! for XSS attacks
      sameSite: "strict", //! for CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    // ! resource created
    res.status(201).json({
      success: true,
      user: newUser,
    });
    logger.info(`User registered, welcome! ${newUser.fullName}`);
  } catch (error) {
    // console.log("Dev Mode-> Debug-> Error in the sign up controller function");
    logger.error(error.message);
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

//login method
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    //! check if user already exists
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    //! match password
    const isPasswordCorrect = await existingUser.matchpassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    //! token
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, //! XSS attack prevention
      sameSite: "strict", //! CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      existingUser,
    });

    //! Loggin login
    logger.info(`${existingUser.fullName} just logged in.`);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

//Logout

export const logout = (req, res) => {
  logger.info("Logout request made");
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "logout successful" });
};

//onBoard

export const onBoard = async (req, res) => {
  try {
    //! req.user has user from protected route
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      logger.error("All fields are required while onboarding");
      return res.status(400).json({
        message: "All fields are required",
        requiredFields: [
          !fullName && "Full Name",
          !bio && "Bio",
          !nativeLanguage && "Native Language",
          !learningLanguage && "Learning Language",
          !location && "Location",
        ].filter(Boolean), //! For truthy values pnly
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnBoard: true,
      },
      { new: true }
    );
    if (!updatedUser) {
      logger.error("User not found, onBoarding failed");
      return res.status(404).json({
        message: "User not found",
      });
    }

    //! Updating the details in stream profile
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      logger.info(
        `Stream user has been updated successfully for ${updatedUser.fullName}`
      );
    } catch (error) {
      logger.error("Error while upserting user", error.message);
    }

    res.status(201).json({
      success: true,
      user: updatedUser,
    });

    logger.info(`Onboarding successful for ${updatedUser.fullName}`);
  } catch (error) {
    console.log(error.message);

    logger.error("Onboarding error: ", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
