"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from "next/link";
import HomepageHeader from "@/components/ui/HomepageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CatchDetailsTable from "@/components/CatchTable";
import { fetchAssetById, type AssetDetails } from "@/lib/api";
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
  
  const [userType, setUserType] = useState<string | null>(null);
  const [assetDetails, setAssetDetails] = useState<AssetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{message: string; details?: any} | null>(null);

  const handleBack = () => { 
    if (userType) {
      router.push(`/homepage/${userType}`);
    } else {
      router.push('/'); // Fallback to home if userType is not available
    }
  };

  useEffect(() => {
    const getUserType = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          router.push('/login');
          return;
        }

        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserType(userDoc.data().userType);
        }
      } catch (err) {
        console.error("Error fetching user type:", err);
      }
    };

    getUserType();
  }, []);

  useEffect(() => {
    const loadAssetDetails = async () => {
      try {
        const data = await fetchAssetById(assetId); // Using dynamic ID from URL
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
  }, [assetId]); // Add assetId as dependency

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

  // Add this label mapping object at the top of your component
  const labelTranslations: { [key: string]: string } = {
    "Species": "Klase sang Isda (Species)",
    "Catch Location": "Lugar kung Diin Gindakop (Catch Location)",
    "Catch Date": "Petsa sang Pagdakop (Catch Date)",
    "Fishing Method": "Pama agi sang Pangisda (Fishing Method)",
    "Fisher": "Fisher",
    "Supplier": "Supplier",
    "Supplier Location": "Supplier Location",
    "Retailers": "Vendor (Retailer)",
    "Retail Locations": "Retailer Location",
    "Consumers": "Customer (Consumer)",
  };

  // Update the formattedDetails array to include displayLabel
  const formattedDetails = assetDetails
    ? [
        { 
          label: "Species", 
          displayLabel: labelTranslations["Species"],
          value: assetDetails.Species 
        },
        { 
          label: "Catch Location", 
          displayLabel: labelTranslations["Catch Location"],
          value: assetDetails.CatchLocation 
        },
        { 
          label: "Catch Date", 
          displayLabel: labelTranslations["Catch Date"],
          value: assetDetails.CatchDate 
        },
        { 
          label: "Fishing Method", 
          displayLabel: labelTranslations["Fishing Method"],
          value: assetDetails.FishingMethod 
        },
        { 
          label: "Fisher", 
          displayLabel: labelTranslations["Fisher"],
          value: extractName(assetDetails.Fisher) 
        },
        {
          label: "Supplier",
          displayLabel: labelTranslations["Supplier"],
          value: extractName(assetDetails.Supplier || "Not assigned")
        },
        {
          label: "Supplier Location",
          displayLabel: labelTranslations["Supplier Location"],
          value: assetDetails.SellingLocationSupplier || "Not assigned"
        },
        {
          label: "Retailers",
          displayLabel: labelTranslations["Retailers"],
          value: extractNamesFromArray(assetDetails.Retailers).map((name, i) => (
            <div key={i}>{name}</div>
          )) || "Not assigned"
        },
        {
          label: "Retail Locations",
          displayLabel: labelTranslations["Retail Locations"],
          value: assetDetails.SellingLocationRetailers.map((loc, i) => (
            <div key={i}>{loc}</div>
          )) || "Not assigned"
        },
        {
          label: "Consumers",
          displayLabel: labelTranslations["Consumers"],
          value: extractNamesFromArray(assetDetails.Consumers).map((name, i) => (
            <div key={i}>{name}</div>
          )) || "Not assigned"
        },
      ]
    : [];
  

  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader title="Catch Details" />
      <main className="min-h-[70vh] bg-[#429FAD] pb-12">
      <div className="w-full h-25 bg-[#429FAD] flex items-center justify-between px-8 pt-[40] md:px-2 sm:px-2">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="text-white"/>
        </Button>
        <div className="bg-white px-6 py-2 shadow-md rounded-md">
          <span className="font-bold text-black text-md md:text-lg lg:text-lg ">{assetDetails.ID}</span>
        </div>
        <div></div>
      </div>

      <div className="mx-auto my-[40] max-w-7xl sm:px-4 text-sm md:text-lg lg:text-lg ">
        <CatchDetailsTable
          assetDetails={formattedDetails}
          editableFields={[]}
        />
      </div>
      </main>
    </div>
  );
}
