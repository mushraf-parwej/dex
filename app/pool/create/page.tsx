import StepPool from "@/components/pool/stepPool";
import Link from "next/link";
import React from "react";
import TopPoolTable from "../TopPoolTable";

const page = () => {
  return (
    <main className="flex flex-row w-full justify-center items-start p-10">
      <div>
        <Link href="/pool">Back</Link>
      </div>
      <div className="w-2/3">
        <StepPool />
      </div>
    </main>
  );
};

export default page;
