import React from "react";
import Navigation from "./Navigation";
import TopPoolTable from "../pool/TopPoolTable";

const page = () => {
  return (
    <main className="flex flex-col justify-center items-center w-full p-10 px-20 ">
      <TopPoolTable />
    </main>
  );
};

export default page;
