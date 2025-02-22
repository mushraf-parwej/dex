import React from "react";
import Navigation from "./Navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col p-10 px-20 space-y-5">
      <Navigation />
      <div className="flex-1 ">{children}</div>
    </div>
  );
};

export default Layout;
