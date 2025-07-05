import { LoaderIcon } from "lucide-react";
import React from "react";

const PageLoader = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      data-theme="forest"
    >
      <span className="loading loading-dots loading-xl text-primary"></span>
    </div>
  );
};

export default PageLoader;
