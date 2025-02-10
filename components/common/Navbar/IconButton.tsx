import React from "react";
import Image from "next/image";

interface IconButtonProps {
  src: string;
  alt: string;
}

const IconButton = ({ src, alt }: IconButtonProps) => (
  <button className="p-2 rounded-lg border hover:bg-neutral-900 transition-colors">
    <Image src={src || "/placeholder.svg"} alt={alt} width={24} height={24} />
  </button>
);

export default IconButton;
