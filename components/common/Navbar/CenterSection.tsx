import React from "react";
import { SearchInput } from "../SearchBar";
const CenterSection = () => {
  return (
    <div className="hidden sm:flex justify-center flex-1 mx-4">
      <SearchInput
        placeholder="Search tokens..."
        className="w-full max-w-[423px]"
        value=""
        onChange={() => {}}
      />
    </div>
  );
};

export default CenterSection;
