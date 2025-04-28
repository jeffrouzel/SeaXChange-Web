"use client";

import { useEffect, useState } from "react";
import HomepageHeader from "@/components/ui/HomepageHeader";
import SearchBar from "@/components/ui/SearchBar";
import TunaCard from "@/components/ui/TunaCard";
import { Filter } from "lucide-react";
import Link from "next/link";
import { fetchAssets } from "@/lib/api";

interface TunaAsset {
  ID: string;
  Species: string;
  CatchDate: string;
  // Weight: number;
  CatchLocation: string;
  Retailers: string[];
}

export default function RetailerHomepage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tunaData, setTunaData] = useState<TunaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTunaData = async () => {
      try {
        const data = await fetchAssets();
        // You might want to filter for assets relevant to retailers
        const filteredData = data.filter((tuna : TunaAsset) => tuna.ID.startsWith('tuna')); // remove id created by app gateway
        setTunaData(filteredData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tuna data');
        console.error('Error fetching tuna data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTunaData();
  }, []);

  // Filter tuna data based on search query
  const filteredTunaData = tunaData.filter((tuna) =>
    tuna.ID.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#429FAD] p-6 flex items-center justify-center">
        <p className="text-white text-lg">Loading tuna data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#429FAD] p-6 flex items-center justify-center">
        <p className="text-white text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#429FAD] p-6">
      <HomepageHeader title="Retailer's Homepage" />

      <div className="flex justify-center my-6 gap-4">
        <SearchBar placeholder="Enter Tuna ID" onSearch={setSearchQuery} />
        <button className="bg-white text-teal-700 px-4 py-2 flex items-center gap-2 rounded-lg shadow hover:bg-teal-100">
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTunaData.map((tuna) => (
          <Link href={`/catchdetails/${tuna.ID}`} key={tuna.ID}>
            <TunaCard
              id={tuna.ID}
              date={new Date(tuna.CatchDate).toLocaleDateString()}
              species={tuna.Species}
              location={tuna.CatchLocation}
              // weight={tuna.Weight}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
