import { VideoIcon } from "lucide-react";

const CallButton = ({ handleVideoCall }) => {
  return (
    <div className="p-3 border-b flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0">
      <button
        onClick={handleVideoCall}
        className="btn btn-success btn-sm text-white"
      >
        <VideoIcon />
      </button>
    </div>
  );
};

export default CallButton;
