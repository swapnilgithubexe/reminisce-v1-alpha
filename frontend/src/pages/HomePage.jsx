import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  BellRing,
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
} from "lucide-react";
import FriendCard from "../components/FriendCard";
import NoFriendComponent from "../components/NoFriendComponent";
import FlagFunction from "../components/FlagFunction";
import { capitalizeString } from "../lib/capitalize";

const HomePage = () => {
  const queryClient = useQueryClient();

  //! tracks the ids of users whom the friend request is sent
  const [outgoingRequestIds, setOutgoingRequestIds] = useState(new Set());

  //! Query for fetching the current user's friends
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  //! Query for getting recommended users based on several factors like same learning lang, same place etc.
  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  //! Query for fetching outgoing requests which are just sent, status is not confirmed (UI data)
  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  //! mutate function to handle a sent friend request action from a client side, on success a refetch is made for the outgoing requests query key to have to upadted real time data through out

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: queryClient.invalidateQueries({
      queryKey: ["outgoingFriendReqs"],
    }),
  });

  useEffect(() => {
    //! temp frnd req holding set to remove duplicates
    const outgoingFriendReqIds = new Set();
    //! duplicate check
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingFriendReqIds.add(req.recipient._id);
      });
      setOutgoingRequestIds(outgoingFriendReqIds);
    }
    //! will run when outgoingFriendReqs changes
  }, [outgoingFriendReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        {/* HEADER COMPONENT - Your Friends */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Start a conversation?
          </h2>
          <Link to="notifications" className="btn btn-outline btn-sm">
            <BellRing className="mr-2 size-4" />
            New requests
          </Link>
        </div>

        {/* //!EDGE CASES */}

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : friends.length === 0 ? (
          <NoFriendComponent />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet new learners
                </h2>
                <p className="opacity-70">
                  Make new friends and explore new languages to learn
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                No recommended users available
              </h3>
              <p className="text-base-content opacity-70">
                Please come back later to explore recommended users!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                //! kind of filtering the sent frnd request
                const hasRequestBeenSent = outgoingRequestIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      {/* IMAGE LOCATION WRAPPER */}
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/*LANGUAGES WITH FLAG //! Capitalize the first letter here to make it more readable, will create badges to show the country flag */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary">
                          {FlagFunction(user.nativeLanguage)}
                          Native: {capitalizeString(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline">
                          {FlagFunction(user.learningLanguage)}
                          Learning: {capitalizeString(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && (
                        <p className="text-sm opacity-70">{user.bio}</p>
                      )}

                      {/* ACTION BUTTON */}
                      <button
                        className={`btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"}`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
