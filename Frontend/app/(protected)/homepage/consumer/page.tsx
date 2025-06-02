"use client";

import { useEffect, useState } from "react";
import HomepageHeader from "@/components/ui/HomepageHeader";
import SearchBar from "@/components/ui/SearchBar";
import TunaCard from "@/components/ui/TunaCard";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { fetchAssets } from "@/lib/api";

interface TunaAsset {
  ID: string;
  Species: string;
  CatchDate: string;
  Weight: number;
  CatchLocation: string;
}

type SortType = 'date' | 'id';

export default function ConsumerHomepage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tunaData, setTunaData] = useState<TunaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortType, setSortType] = useState<SortType>('date');
  const [showSortOptions, setShowSortOptions] = useState(false);

  useEffect(() => {
    const loadTunaData = async () => {
      try {
        const data = await fetchAssets();
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
  const filteredTunaData = tunaData
    .filter((tuna) =>
      tuna.ID.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortType === 'date') {
        const dateA = new Date(a.CatchDate).getTime();
        const dateB = new Date(b.CatchDate).getTime();
        return dateB - dateA;
      } else {
        const idA = parseInt(a.ID.replace(/\D/g, '')) || 0;
        const idB = parseInt(b.ID.replace(/\D/g, '')) || 0;
        return idB - idA;
      }
    });

  const handleSortChange = (newSortType: SortType) => {
    setSortType(newSortType);
    setShowSortOptions(false);
  };

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
    <div className="min-h-screen bg-gradient-to-b from-[#429FAD] via-[#57acb9] to-[#6fc0cc] p-6">
      <HomepageHeader title="Retailer's Homepage" />

      <div className="flex flex-col md:flex-row justify-center items-center md:space-x-2 space-y-2 md:space-y-0 my-6">  {/* Changed space-x-4 to space-x-2 */}
        {/* Search bar container */}
        <div className="w-half max-w-md">
          <SearchBar placeholder="Enter Tuna ID" onSearch={setSearchQuery} />
        </div>
        
        {/* Sort button container */}
        <div className="relative w-[150px]">
          <button
            onClick={() => setShowSortOptions(!showSortOptions)}
            className="w-full bg-white text-teal-700 px-4 py-2 flex items-center justify-center rounded-lg shadow hover:bg-teal-100"
          >
            Sort by {sortType === 'date' ? 'Date' : 'ID'}
            <ChevronDown size={18} />
          </button>
          
          {showSortOptions && (
            <div className="absolute right-0 mt-2 w-full bg-white rounded-lg shadow-lg z-10">
              <button
                onClick={() => handleSortChange('date')}
                className="w-full text-center px-4 py-2 hover:bg-teal-100 rounded-t-lg"
              >
                Sort by Date
              </button>
              <button
                onClick={() => handleSortChange('id')}
                className="w-full text-center px-4 py-2 hover:bg-teal-100 rounded-b-lg"
              >
                Sort by ID
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTunaData.map((tuna) => (
          <Link href={`/viewdetails/${tuna.ID}`} key={tuna.ID}>
            <TunaCard
              id={tuna.ID}
              date={new Date(tuna.CatchDate).toLocaleDateString()}
              species={tuna.Species}
              location={tuna.CatchLocation}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
