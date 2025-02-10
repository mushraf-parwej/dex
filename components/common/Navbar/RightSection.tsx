import React from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import IconButton from "./IconButton";
import { notification, theme } from "@/public/assets/navbar";

const RightSection = () => {
  return (
    <div className="flex items-center justify-end gap-4">
      <ConnectButton showBalance={false} />
      <div className="hidden md:flex items-center gap-4">
        <IconButton src={notification} alt="Notifications" />
        <IconButton src={theme} alt="Theme" />
      </div>
    </div>
  );
};

export default RightSection;
