"use client";

import { useEffect, useState } from 'react';
import Link from "next/link";
import HomepageHeader from "@/components/ui/HomepageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CatchDetailsTable from "@/components/CatchTable";
import { fetchAssetById, type AssetDetails } from "@/lib/api";

export default function CatchDetailsPage() {
  const [assetDetails, setAssetDetails] = useState<AssetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{message: string; details?: any} | null>(null);

  useEffect(() => {
    const loadAssetDetails = async () => {
      try {
        const data = await fetchAssetById("tuna1"); // Note: using lowercase to match API data
        setAssetDetails(data);
        setError(null);
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : 'Failed to fetch asset details',
          details: err
        });
        setAssetDetails(null);
      } finally {
        setLoading(false);
      }
    };

    loadAssetDetails();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Loading asset details...</p>
    </div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-red-500 font-bold mb-2">Error: {error.message}</p>
        {error.details && (
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-w-full">
            {JSON.stringify(error.details, null, 2)}
          </pre>
        )}
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!assetDetails) {
    return <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">No asset details found</p>
    </div>;
  }

  const formattedDetails = [
    { label: "ID", value: assetDetails.ID },
    { label: "Species", value: assetDetails.Species },
    { label: "Weight (kg)", value: assetDetails.Weight.toString() },
    { label: "Catch Location", value: assetDetails.CatchLocation },
    { label: "Catch Date", value: assetDetails.CatchDate },
    { label: "Fishing Method", value: assetDetails.FishingMethod },
    { label: "Fisher", value: assetDetails.Fisher },
    { label: "Supplier", value: assetDetails.Supplier || "Not assigned" },
    { label: "Supplier Location", value: assetDetails.SellingLocationSupplier || "Not assigned" },
    { label: "Retailers", value: assetDetails.Retailers.join(", ") || "Not assigned" },
    { label: "Retail Locations", value: assetDetails.SellingLocationRetailers.join(", ") || "Not assigned" },
    { label: "Consumers", value: assetDetails.Consumers.join(", ") || "Not assigned" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader title="Catch Details" />
      <main className="min-h-[70vh] bg-[#429FAD]">
        <div className="w-full h-25 bg-[#429FAD] flex items-center justify-between px-8 pt-[40]">
          <Button variant="ghost" size="icon">
            <Link href="/dashboard">
              <ArrowLeft className="text-white" />
            </Link>
          </Button>
          <div className="bg-white px-6 py-2 shadow-md rounded-md">
            <span className="font-bold text-black">{assetDetails.ID}</span>
          </div>
          <div></div>
        </div>

        <div className="mx-[150] my-[40]">
          <CatchDetailsTable
            assetDetails={formattedDetails}
            editableFields={[]}
          />
        </div>
      </main>
    </div>
  );
}
