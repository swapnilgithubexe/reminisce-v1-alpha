import React from "react";
import FlagFunction from "./FlagFunction";
import { Link } from "react-router";
import { capitalizeString } from "../lib/capitalize";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold truncate ">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {FlagFunction(friend.nativeLanguage)}
            Native: {capitalizeString(friend.nativeLanguage)}
          </span>

          <span className="badge badge-outline text-xs">
            {FlagFunction(friend.learningLanguage)}
            Learning: {capitalizeString(friend.learningLanguage)}
          </span>
        </div>

        {/* CHAT PAGE ACCESS */}
        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;
