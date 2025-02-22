import CreatePool from "@/components/pool/createPool";
import StepPool from "@/components/pool/stepPool";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import TopPoolTable from "./TopPoolTable";

const page = () => {
  return (
    <main className="flex flex-col w-full justify-center items-center p-10 px-40 gap-10 ">
      {/* <div className="w-2/3">
        <StepPool />
      </div> */}
      <section className="w-full">
        <div className="flex flex-col justify-center items-start w-full gap-3">
          <h1 className="font-semibold text-lg  ">Your Position</h1>
          <Link
            className="red-btn flex flex-row items-center gap-1"
            href="/pool/create"
          >
            <Plus /> New
          </Link>
        </div>
      </section>

      {/* table section */}
      <TopPoolTable />
    </main>
  );
};

export default page;
