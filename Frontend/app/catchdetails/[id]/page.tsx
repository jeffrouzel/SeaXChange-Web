"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Pencil, ArrowLeft } from "lucide-react";
import SendCard from "@/components/ui/SendCard";
import CatchDetailsTable from "@/components/CatchTable";
import SaveAlert from "@/components/SaveAlert";
import SendAlert from "@/components/SendAlert";
import HomepageHeader from "@/components/ui/HomepageHeader";
import { fetchAssetById, type AssetDetails } from "@/lib/api";

export default function CatchDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const assetId = params.id as string;

  const [assetDetails, setAssetDetails] = useState<AssetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{message: string; details?: any} | null>(null);
  const [isSendCardOpen, setIsSendCardOpen] = useState(false);
  const [isDetailsSaved, setIsDetailsSaved] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleOpenSendCard = () => setIsSendCardOpen(true);
  const handleCloseSendCard = () => setIsSendCardOpen(false);
  const handleSaveDetails = () => setIsDetailsSaved(true);

  useEffect(() => {
    const loadAssetDetails = async () => {
      try {
        const data = await fetchAssetById(assetId);
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
  }, [assetId]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Loading asset details...</p>
    </div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-red-500 font-bold mb-2">Error: {error.message}</p>
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

  const editableFields: string[] = [
    "Species",
    // "Weight",
    "CatchLocation",
    "CatchDate",
    "FishingMethod",
  ];

  const formattedDetails = assetDetails ? [
    { label: "Species", value: assetDetails.Species },
    // { label: "Weight (kg)", value: assetDetails.Weight.toString() },
    { label: "Catch Location", value: assetDetails.CatchLocation },
    { label: "Catch Date", value: assetDetails.CatchDate },
    { label: "Fishing Method", value: assetDetails.FishingMethod },
    { label: "Fisher", value: assetDetails.Fisher },
    { label: "Supplier", value: assetDetails.Supplier || "NA" },
    { label: "Retailer", value: assetDetails.Retailers.join(", ") || "NA" },
    { label: "Consumer", value: assetDetails.Consumers.join(", ") || "NA" },
  ] : [];

  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader title="Catch Details" />
      <main className="min-h-[70vh] bg-[#429FAD] pb-20">
        <div className="w-full h-25 bg-[#429FAD] flex items-center justify-between px-8 pt-6">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="text-white" />
          </Button>
          <div className="bg-white px-6 py-2 shadow-md rounded-md">
            <span className="font-bold text-black">{assetDetails?.ID}</span>
          </div>
          <div></div>
        </div>

        <div className="mx-auto max-w-5xl px-4 my-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <CatchDetailsTable
              assetDetails={formattedDetails}
              editableFields={isDetailsSaved ? [] : editableFields}
            />
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-evenly">
          <div />
          {!isDetailsSaved ? <SaveAlert onSave={handleSaveDetails} /> : null}
          {!isDetailsSaved ? <SendAlert /> : null}
          {isDetailsSaved && (
            <Button variant="outline" onClick={handleOpenSendCard}>
              Send Tuna
            </Button>
          )}
          <div />
        </div>
      </main>

      {isSendCardOpen && <SendCard onClose={handleCloseSendCard} />}
    </div>
  );
}
