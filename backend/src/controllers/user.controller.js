import { User } from "../models/User.js";
import logger from "../utils/logger.js";

export const getRecommendedUsers = async (req, res) => {
  try {
    //! user by Id
    const currentUserId = req.user._id;

    // const currentUser = await User.findById({ currentUserId });

    //! user from req.user
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //! excluding user
        { $id: { $nin: currentUser.friends } }, //! for excluding friends of the user,
        { isOnBoard: true },
      ]
    });

    logger.info(`recommended users fetched for ${currentUser.fullName}`)

    res.status(200).json(recommendedUsers);
  } catch (error) {
    logger.error(error.message);
  }
}

export const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("friends").populate("friends", "fullName profilePic nativeLanguage learningLanguage");

    logger.info(`Friends fetched for ${user.fullName}`);

    res.status(200).json(user.friends);
  } catch (error) {
    logger.error(error.message);
  }
}