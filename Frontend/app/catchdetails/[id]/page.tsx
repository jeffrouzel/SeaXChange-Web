"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pencil, ArrowLeft } from "lucide-react";
import SendCard from "@/components/ui/SendCard";
import CatchDetailsTable from "@/components/CatchTable";
import SaveAlert from "@/components/SaveAlert";
import SendAlert from "@/components/SendAlert";
import HomepageHeader from "@/components/ui/HomepageHeader";
import { fetchAssetById, type AssetDetails } from "@/lib/api";

import { getEditableFieldsForRole } from "@/lib/editableFieldsByRole";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase.config";

const extractName = (value: string): string => {
  const parts = value.split(':');
  return parts.length > 1 ? parts.slice(1).join(':').trim() : value;
};

const extractNamesFromArray = (values: string[] = []): string[] => {
  return values.map(extractName);
};

export default function CatchDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const assetId = params.id as string;

  const [assetDetails, setAssetDetails] = useState<AssetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; details?: any } | null>(
    null
  );
  const [isSendCardOpen, setIsSendCardOpen] = useState(false);
  const [isDetailsSaved, setIsDetailsSaved] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleOpenSendCard = () => setIsSendCardOpen(true);
  const handleCloseSendCard = () => setIsSendCardOpen(false);
  const handleSaveDetails = () => setIsDetailsSaved(true);

  const [editableFields, setEditableFields] = useState<string[]>([]);

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const loadAssetDetails = async () => {
      try {
        const data = await fetchAssetById(assetId);
        setAssetDetails(data);

        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          const role = userDoc.exists() ? userDoc.data().userType : null;

          if (role) {
            setUserRole(role);
            const allowedFields = getEditableFieldsForRole(role);
            setEditableFields(allowedFields);
          }
        }
        setError(null);
      } catch (err) {
        setError({
          message:
            err instanceof Error
              ? err.message
              : "Failed to fetch asset details",
          details: err,
        });
        setAssetDetails(null);
      } finally {
        setLoading(false);
      }
    };

    loadAssetDetails();
  }, [assetId]);

  // For access based features on shared catch table
  const canEditAndSave = () => {
    if (!assetDetails || !userRole) return false;

    const supplierUnassigned = !assetDetails.Supplier;
    const supplierLocUnassigned = !assetDetails.SellingLocationSupplier;
    const retailersUnassigned = !assetDetails.Retailers?.length;
    const retailLocUnassigned = !assetDetails.SellingLocationRetailers?.length;
    const consumersUnassigned = !assetDetails.Consumers?.length;

    if (
      supplierUnassigned &&
      supplierLocUnassigned &&
      retailersUnassigned &&
      retailLocUnassigned &&
      consumersUnassigned &&
      userRole === "fisher"
    ) {
      return true;
    }

    if (
      !supplierUnassigned &&
      retailersUnassigned &&
      retailLocUnassigned &&
      consumersUnassigned &&
      userRole === "supplier"
    ) {
      return true;
    }

    if (
      !retailersUnassigned ||
      !retailLocUnassigned ||
      !consumersUnassigned &&
      userRole === "retailer"
    ) {
      return true;
    }

    return false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading asset details...</p>
      </div>
    );
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

  const formattedDetails = assetDetails
    ? [
        { label: "Species", value: assetDetails.Species },
        // { label: "Weight (kg)", value: assetDetails.Weight.toString() },
        { label: "Catch Location", value: assetDetails.CatchLocation },
        { label: "Catch Date", value: assetDetails.CatchDate },
        { label: "Fishing Method", value: assetDetails.FishingMethod },
        { label: "Fisher", value: extractName(assetDetails.Fisher) },
        { label: "Supplier", value: extractName(assetDetails.Supplier || "Not assigned") },
        { label: "Supplier Location", value: assetDetails.SellingLocationSupplier || "Not assigned" },
        { label: "Retailers", value: extractNamesFromArray(assetDetails.Retailers).map((name, i) => <div key={i}>{name}</div>) || "Not assigned" },
        { label: "Retail Locations", value: assetDetails.SellingLocationRetailers.map((loc, i) => <div key={i}>{loc}</div>) || "Not assigned" },
        { label: "Consumers", value: extractNamesFromArray(assetDetails.Consumers).map((name, i) => <div key={i}>{name}</div>) || "Not assigned" }

      ]
    : [];

  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader title="Catch Details" />
      <main className="min-h-[70vh] bg-[#429FAD] pb-20">
        <div className="w-full h-25 bg-[#429FAD] flex items-center justify-between px-8 pt-6">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="text-white" />
          </Button>
          <div className="bg-white px-6 py-2 shadow-md rounded-md">
            <span className="font-bold text-black text-md md:text-lg lg:text-lg">{assetDetails?.ID}</span>
          </div>
          <div></div>
        </div>

        <div className="mx-auto max-w-5xl px-4 my-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden text-sm md:text-lg lg:text-lg">
            <CatchDetailsTable
              assetDetails={formattedDetails}
              editableFields={isDetailsSaved ? [] : editableFields}
            />
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-evenly">
          <div />
          {!isDetailsSaved && canEditAndSave() && (
            <>
              <SaveAlert onSave={handleSaveDetails} />
              <SendAlert />
            </>
          )}

          {isDetailsSaved && canEditAndSave() && (
            <Button variant="outline" onClick={handleOpenSendCard}>
              Send Tuna
            </Button>
          )}
          {/* {isDetailsSaved && (
            <Button variant="outline" onClick={handleOpenSendCard}>
              Send Tuna
            </Button>
          )} */}
          <div />
        </div>
      </main>

      {isSendCardOpen && <SendCard onClose={handleCloseSendCard} />}
    </div>
  );
}
