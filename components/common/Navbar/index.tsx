"use client";
import React from "react";
// import LeftSection from "./Navbar/LeftSection";
// import CenterSection from "./Navbar/CenterSection";
// import RightSection from "./Navbar/RightSection";
// import MobileDrawer from "./Navbar/MobileDrawer";
import LeftSection from "./LeftSection";
import CenterSection from "./CenterSection";
import RightSection from "./RightSection";
import MobileDrawer from "./MobileDrawer";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between w-full h-[72px] border-b px-4 sm:px-8">
      <LeftSection />
      <CenterSection />
      <RightSection />
      <MobileDrawer />
    </nav>
  );
};

export default Navbar;
