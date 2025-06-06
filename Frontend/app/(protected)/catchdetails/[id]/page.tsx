"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pencil, ArrowLeft } from "lucide-react";
import SendCard from "@/components/ui/SendCard";
import CatchDetailsTable from "@/components/CatchTable";
import SaveAlert from "@/components/SaveAlert";
import HomepageHeader from "@/components/ui/HomepageHeader";
import { fetchAssetById, type AssetDetails } from "@/lib/api";

import { getEditableFieldsForRole } from "@/lib/editableFieldsByRole";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase.config";

interface UserData {
  customId: string;
  name: string;
  userType: string;
}

const extractName = (value: string): string => {
  const parts = value.split(":");
  return parts.length > 1 ? parts.slice(1).join(":").trim() : value;
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
  const [editableFields, setEditableFields] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const handleBack = () => {
    router.back();
  };

  const handleOpenSendCard = () => setIsSendCardOpen(true);
  const handleCloseSendCard = () => setIsSendCardOpen(false);
  const handleSaveDetails = () => setIsDetailsSaved(true);

  const checkAssetAccess = (
    asset: AssetDetails,
    userIdentifier: string,
    role: string
  ): { hasAccess: boolean; accessType: "full" | "readonly" | "none" } => {
    // Check for full access first
    switch (role.toLowerCase()) {
      case "fisher":
        if (asset.Fisher === userIdentifier) {
          return { hasAccess: true, accessType: "full" };
        }
        break;
      case "supplier":
        if (asset.Supplier === userIdentifier) {
          return { hasAccess: true, accessType: "full" };
        }
        break;
      case "retailer":
        if (asset.Retailers?.includes(userIdentifier)) {
          return { hasAccess: true, accessType: "full" };
        }
        break;
      case "consumer":
        if (asset.Consumers?.includes(userIdentifier)) {
          return { hasAccess: true, accessType: "full" };
        }
        break;
    }

    // If no full access, check if they can view
    if (role.toLowerCase() === "consumer") {
      return { hasAccess: true, accessType: "readonly" };
    }

    return { hasAccess: false, accessType: "none" };
  };

  useEffect(() => {
    const checkAccessAndLoadDetails = async () => {
      try {
        setIsCheckingAccess(true);
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          router.push("/login");
          return;
        }

        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (!userDoc.exists()) {
          throw new Error("User data not found");
        }

        const currentUserData = userDoc.data() as UserData;
        const data = await fetchAssetById(assetId);

        // Check access before doing anything else
        const userIdentifier = `${currentUserData.customId}:${currentUserData.name}`;
        const access = checkAssetAccess(
          data,
          userIdentifier,
          currentUserData.userType
        );

        // Immediately redirect if no access, before any state updates
        if (access.accessType === "none") {
          router.replace(`/viewdetails/${assetId}`); // Using replace instead of push
          return;
        }

        // Only proceed with state updates if user has access
        setUserData(currentUserData);
        setAssetDetails(data);
        setUserRole(currentUserData.userType);

        if (access.accessType === "full") {
          const allowedFields = getEditableFieldsForRole(
            currentUserData.userType
          );
          setEditableFields(allowedFields);
        } else {
          setEditableFields([]);
        }
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
        setIsCheckingAccess(false);
        setLoading(false);
      }
    };

    checkAccessAndLoadDetails();
  }, [assetId, router]);

  const canEditAndSave = () => {
    if (!assetDetails || !userRole || editableFields.length === 0) return false;

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
      (!consumersUnassigned && userRole === "retailer")
    ) {
      return true;
    }

    return false;
  };

  // Show loading screen while checking access
  if (isCheckingAccess || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <HomepageHeader title="Catch Details" />
        <main className="flex-1 bg-[#429FAD] flex items-center justify-center">
          <div className="bg-white px-6 py-4 shadow-md rounded-md flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
            <p className="text-lg font-medium text-teal-700">
              Checking access...
            </p>
          </div>
        </main>
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

  // Add this label mapping object at the top of your component
  const labelTranslations: { [key: string]: string } = {
    Species: "Klase sang Isda (Species)",
    "Catch Location": "Lugar kung Diin Gindakop (Catch Location)",
    "Catch Date": "Petsa sang Pagdakop (Catch Date)",
    "Fishing Method": "Pama agi sang Pangisda (Fishing Method)",
    Fisher: "Fisher",
    Supplier: "Supplier",
    "Supplier Location": "Supplier Location",
    Retailers: "Vendor (Retailer)",
    "Retail Locations": "Retailer Location",
    Consumers: "Customer (Consumer)",
  };

  // Update the formattedDetails array to include displayLabel
  const formattedDetails = assetDetails
    ? [
        {
          label: "Species",
          displayLabel: labelTranslations["Species"],
          value: assetDetails.Species,
        },
        {
          label: "Catch Location",
          displayLabel: labelTranslations["Catch Location"],
          value: assetDetails.CatchLocation,
        },
        {
          label: "Catch Date",
          displayLabel: labelTranslations["Catch Date"],
          value: assetDetails.CatchDate,
        },
        {
          label: "Fishing Method",
          displayLabel: labelTranslations["Fishing Method"],
          value: assetDetails.FishingMethod,
        },
        {
          label: "Fisher",
          displayLabel: labelTranslations["Fisher"],
          value: extractName(assetDetails.Fisher),
        },
        {
          label: "Supplier",
          displayLabel: labelTranslations["Supplier"],
          value: extractName(assetDetails.Supplier || "Not assigned"),
        },
        {
          label: "Supplier Location",
          displayLabel: labelTranslations["Supplier Location"],
          value: assetDetails.SellingLocationSupplier || "Not assigned",
        },
        {
          label: "Retailers",
          displayLabel: labelTranslations["Retailers"],
          value:
            extractNamesFromArray(assetDetails.Retailers).map((name, i) => (
              <div key={i}>{name}</div>
            )) || "Not assigned",
        },
        {
          label: "Retail Locations",
          displayLabel: labelTranslations["Retail Locations"],
          value: assetDetails.SellingLocationRetailers.map((loc, i) => (
            <div key={i}>{loc}</div>
          )) || "Not assigned",
        },
        {
          label: "Consumers",
          displayLabel: labelTranslations["Consumers"],
          value:
            extractNamesFromArray(assetDetails.Consumers).map((name, i) => (
              <div key={i}>{name}</div>
            )) || "Not assigned",
        },
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
            <span className="font-bold text-black text-md md:text-lg lg:text-lg">
              {assetDetails?.ID}
            </span>
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
          {canEditAndSave() && (
            <>
              {/* {!isDetailsSaved && (
                <>
                  <SaveAlert onSave={handleSaveDetails} />
                </>
              )}

              {isDetailsSaved && (
                <Button 
                className="bg-[#357C87] text-white hover:bg-white hover:text-[#429FAD] transition-colors duration-200"
                // variant="outline" 
                onClick={handleOpenSendCard}>
                  Send Tuna
                </Button>
              )} */
              <Button 
                className="bg-[#357C87] text-white hover:bg-white hover:text-[#429FAD] transition-colors duration-200"
                // variant="outline" 
                onClick={handleOpenSendCard}>
                  Send Tuna
                </Button>
              }
            </>
          )}
          <div />
        </div>
      </main>

      {isSendCardOpen && <SendCard onClose={handleCloseSendCard} />}
    </div>
  );
}
