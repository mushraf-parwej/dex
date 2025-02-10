import React from "react";
import Image from "next/image";

interface MobileIconButtonProps {
  src: string;
  alt: string;
  label: string;
}

const MobileIconButton = ({ src, alt, label }: MobileIconButtonProps) => {
  return (
    <button className="flex items-center gap-2 p-2 rounded-lg border hover:bg-neutral-900 transition-colors">
      <Image src={src || "/placeholder.svg"} alt={alt} width={24} height={24} />
      <span>{label}</span>
    </button>
  );
};

export default MobileIconButton;
