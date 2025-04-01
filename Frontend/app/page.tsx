"use client";

import HomepageHeader from "@/components/ui/HomepageHeader";
import SearchBar from "@/components/ui/SearchBar";
import TunaCard from "@/components/ui/TunaCard";
import { useState } from "react";
import Link from "next/link";

export default function ConsumerHomepage() {
  const [searchQuery, setSearchQuery] = useState("");

  const tunaData = [
    { id: "tuna1", date: "Dec 1, 2024", status: "Available" },
    { id: "tuna2", date: "Dec 2, 2024", status: "Sold" },
    { id: "tuna3", date: "Dec 3, 2024", status: "Available" },
    { id: "tuna4", date: "Dec 4, 2024", status: "Available" },
  ];

  const filteredTunaData = tunaData.filter((tuna) =>
    tuna.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#429FAD] p-6">
      <HomepageHeader title="Consumer's Homepage" />

      <div className="flex justify-center my-6 gap-4">
        <SearchBar placeholder="Enter Tuna ID" onSearch={setSearchQuery} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {filteredTunaData.map((tuna) => (
          <Link href={`/viewdetails/${tuna.id}`} key={tuna.id}>
            <TunaCard id={tuna.id} date={tuna.date} status={tuna.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
