import React from "react";
import Link from "next/link";

interface NavLinkProps {
  href: string;
  label: string;
}

const NavLink = ({ href, label }: NavLinkProps) => (
  <Link
    href={href}
    className="font-medium text-neutral-400 hover:text-red transition-colors"
  >
    {label}
  </Link>
);

export default NavLink;
