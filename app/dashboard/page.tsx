"use client";

import AddPassword from "@/components/AddPassword";
import { variants } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { fetchPasswords } from "@/lib/ServerActions/passwords";
import { useState } from "react";

export default function Dashboard() {
  const [search, setSearch] = useState<string>("");

  return (
    <div className="min-h-screen w-full max-w-2xl h-full flex flex-col items-center justify-start py-4">
      <div className="flex flex-col items-start w-full gap-8">
        <Heading size="l">My Passwords</Heading>
        <AddPassword />
        <input
          className={variants({ variant: "input" }) + " w-full"}
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <button
        onClick={async () => {
          const res = await fetchPasswords();
          console.log(res);
        }}
      >
        Fetch Passwords
      </button>
    </div>
  );
}
