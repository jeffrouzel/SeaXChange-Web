"use client";

import { useEffect, useState } from 'react';
import Link from "next/link";
import HomepageHeader from "@/components/ui/HomepageHeader";
import { Button } from "@/components/ui/button";
import { fetchAssets, type AssetDetails } from "@/lib/api";

export default function DashboardPage() {
  const [assets, setAssets] = useState<AssetDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const data = await fetchAssets();
        setAssets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch assets');
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Loading assets...</p>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-500">{error}</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader title="Catch Records" />
      <main className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-10">
          {assets.map((asset) => (
            <Link 
              key={asset.ID} 
              href={`/viewdetails/${asset.ID}`}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-[#429FAD]">{asset.ID}</h3>
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-semibold">Species:</span> {asset.Species}</p>
                  <p><span className="font-semibold">Location:</span> {asset.CatchLocation}</p>
                  <p><span className="font-semibold">Date:</span> {asset.CatchDate}</p>
                  <p><span className="font-semibold">Fisher:</span> {asset.Fisher}</p>
                  <div className="mt-4">
                    <span className="inline-block bg-[#429FAD] text-white text-sm px-3 py-1 rounded-full">
                      {asset.Weight} kg
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}