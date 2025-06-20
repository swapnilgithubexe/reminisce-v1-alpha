import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecretKey = process.env.STREAM_SECRET_KEY;

if (!apiKey || !apiSecretKey) {
  console.error("Stream API key or Secret key is invalid/missing")
}

const streamClient = StreamChat.getInstance(apiKey, apiSecretKey);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.log("Dev Mode: Error upserting stream user");

  }
};

// TODO: Stream token generation
export const generateStreamToken = (userId) => {

}