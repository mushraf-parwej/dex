import CreatePool from "@/components/pool/createPool";
import StepPool from "@/components/pool/stepPool";
import React from "react";

const page = () => {
  return (
    <main className="flex flex-col w-full justify-center items-center ">
      <div className="w-2/3">
        <StepPool />
      </div>
    </main>
  );
};

export default page;
