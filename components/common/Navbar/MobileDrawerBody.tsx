import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import MobileIconButton from "./MobileIconButton";
import { notification, theme } from "@/public/assets/navbar";
import { SearchInput } from "../SearchBar";
import NavLink from "./NavLink";

const MobileDrawerBody = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <NavLink href="/" label="Trade" />
        <NavLink href="/pool" label="Pool" />
        <NavLink href="/explore" label="Explore" />
      </div>
      <div className="flex flex-col gap-4">
        <MobileIconButton
          src={notification}
          alt="Notifications"
          label="Notifications"
        />
        <MobileIconButton src={theme} alt="Theme" label="Theme" />
      </div>
      <ConnectButton showBalance={false} />
      <div className="sm:hidden mt-4">
        <SearchInput
          placeholder="Search tokens..."
          className="w-full"
          value=""
          onChange={() => {}}
        />
      </div>
    </div>
  );
};

export default MobileDrawerBody;
