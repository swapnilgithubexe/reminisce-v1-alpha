import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { getStreamToken } from "../lib/api";

//! required imports from stream-chat-react
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import { Video } from "lucide-react";
import CallButton from "../components/CallButton";

const ChatPage = () => {
  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

  const { id: targetUserId } = useParams();

  //! allow us to communicate with stream state
  const [chatClient, setChatClient] = useState(null);
  //! chat channel
  const [channel, setChannel] = useState(null);
  //! initial loading
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  // const queryClient = useQueryClient();

  const { data: tokendata } = useQuery({
    queryKey: ["streamUser"],
    queryFn: getStreamToken,
    enabled: !!authUser,
    //! enabled is used because we want the query function to work when the value of authUser is defined, we couldve used useEffect too, but we would have lost the powers of tanstack query
  });

  useEffect(() => {
    const initializeChat = async () => {
      if (!tokendata?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");
        //! the client will return the same instance which was create/newly created
        const client = StreamChat.getInstance(STREAM_API_KEY);

        //! auth check happens under the hood, as token is generated from stream api as well
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokendata.token
        );

        //! creates a channel id and sorting it coz the order doesnt matter, coz both parties can init the chat
        const channelId = [authUser._id, targetUserId].sort().join("-");

        //! channel which has 2 users rn
        const currentChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        //! listening to any changes made
        await currentChannel.watch();
        setChatClient(client);
        setChannel(currentChannel);
      } catch (error) {
        console.log(error.message);
        toast.error("Could not connect to chat, Please try again later!");
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [authUser, tokendata, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I have initiated a video call, Join me here: ${callUrl}`,
      });

      toast.success("Video call link shared in the chat.");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
