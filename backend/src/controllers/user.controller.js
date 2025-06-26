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
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("friends").populate("friends", "fullName profilePic nativeLanguage learningLanguage");

    logger.info(`Friends fetched for ${user.fullName}`);

    res.status(200).json(user.friends);
  } catch (error) {
    logger.error("Error in get recommended users controller function: ", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
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
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

// acceptFriendRequest
export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      logger.error("Friend request not found");
      return res.status(404).json({
        message: "Friend request not found"
      })
    }

    //! check to ensure that the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      //! it means if the instance of the friend request has me has its recipient than this request belongs to me
      logger.error("You are not authorized to accept this friend request");
      return res.status(403).json({
        message: "You are not authorized to accept this friend request"
      })
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    //! since the requested has been accepted we need to update the firends array in both of their accounts
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient }
    })
    //! We can also use $push but it might create a duplicate entity, if by chance the request is hit twice
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender }
    })

    logger.info(`Friend request accepted`);
    res.status(200).json({
      message: `Friend request accepted`
    })
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export const getFriendRequests = async (req, res) => {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage leraningLanguage");

    const acceptedRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted"
    }).populate("recipient", "fullName profilePic")

    logger.info("Incoming and Accepted requests have been fetched")

    res.status(200).json({
      incomingRequests, acceptedRequests
    })


  } catch (error) {
    logger.error(error.message);
  }
}

export const getOutgoingRequests = async (req, res) => {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending"
    }).populate("recipient", "fullName profilePic nativaLanguage learningLanguage")

    logger.info("Outgoing requests has been fetched");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}