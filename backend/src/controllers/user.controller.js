import FriendRequest from "../models/FriendRequest.js";
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
    logger.error("Error in get recommended users controller function: ", error.message);
  }
}

export const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("friends").populate("friends", "fullName profilePic nativeLanguage learningLanguage");

    logger.info(`Friends fetched for ${user.fullName}`);

    res.status(200).json(user.friends);
  } catch (error) {
    logger.error("Error in get recommended users controller function: ", error.message);
  }
}

// Friend Request
export const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user.id;

    const { id: recipientId } = req.params;

    //!preventing sending req to myself
    if (myId === recipientId) {
      logger.error(`Oops, you can't send a friend request to yourself ${req.user.fullName}`);
      return res.status(400).json({
        message: "You can't send a friend request to yourself"
      })
    };

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      logger.error("Recipient not found");
      return res.status(404).json({
        message: "Recipient not found"
      })
    };

    //! checking if user is already a friend
    if (!recipient.friends.includes(myId)) {
      logger.error("You are already friends with this user");
      return res.status(400).json({
        message: "You are already friends with this user"
      })
    }

    //! check if a frnd req exists
    const existingRequest = await FriendRequest.findOne({
      //! or is used here to check if either of us has sent a friend request or not, is there any instance where me is sender and other person is the reciever or vice versa
      $or: [
        {
          sender: myId, recipient: recipientId
        },
        {
          sender: recipientId, recipient: myId
        }
      ]
    })

    if (existingRequest) {
      logger.error(`A friend request alreay exists between ${req.user.fullName} and ${recipient.fullName}`);
      return res.status(400).json({
        message: "A friend request alreay exists between you and this recipient"
      })
    }
    const friendRequest = new FriendRequest({
      sender: myId,
      recipient: recipientId
    })
    await friendRequest.save();
    logger.info(`A friend request has been sent between ${req.user.fullName} and ${recipient.fullName}`);

    res.status(201).json(friendRequest);
  } catch (error) {
    logger.error(error.message);
  }
}