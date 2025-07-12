import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSideBar = false }) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSideBar && <Sidebar />}

        <div className="flex flex-1 flex-col">
          <Navbar />

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
