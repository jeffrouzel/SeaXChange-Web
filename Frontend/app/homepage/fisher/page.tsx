"use client";

import HomepageHeader from "@/components/ui/HomepageHeader";
import SearchBar from "@/components/ui/SearchBar";
import TunaCard from "@/components/ui/TunaCard";
import { Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function FisherHomepage() {
  const [searchQuery, setSearchQuery] = useState("");

  const tunaData = [
    { id: "TUNA1", date: "Dec 1, 2024", status: "Available" },
    { id: "TUNA2", date: "Dec 2, 2024", status: "Sold" },
    { id: "TUNA3", date: "Dec 3, 2024", status: "Available" },
    { id: "TUNA4", date: "Dec 4, 2024", status: "Available" },
  ];

  // Filter tuna data based on search query
  const filteredTunaData = tunaData.filter((tuna) =>
    tuna.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#429FAD] p-6">
      {/* Header */}
      <HomepageHeader title="Fisher's Homepage" />

      {/* Search and Add */}
      <div className="flex justify-center my-6 gap-4">
        <SearchBar placeholder="Enter Tuna ID" onSearch={setSearchQuery} />
        <Link href="/catchdetails">
          <button className="bg-white text-teal-700 px-4 py-2 flex items-center gap-2 rounded-lg shadow hover:bg-teal-100">
            <Plus size={18} /> ADD CATCH
          </button>
        </Link>
      </div>

      {/* Tuna Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredTunaData.map((tuna, index) => (
          <Link href="/viewdetails">
            <TunaCard
              key={index}
              id={tuna.id}
              date={tuna.date}
              status={tuna.status}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
