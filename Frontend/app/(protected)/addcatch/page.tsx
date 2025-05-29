"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Weight } from "lucide-react";
import SendCard from "@/components/ui/SendCard";
import CatchDetailsTable from "@/components/CatchTable";
import SaveAlert from "@/components/SaveAlert";
import SendAlert from "@/components/SendAlert";
import HomepageHeader from "@/components/ui/HomepageHeader";
import { getEditableFieldsForRole } from "@/lib/editableFieldsByRole";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase.config";
import { createAsset } from "@/lib/api"; // Adjust the import path as necessary

export default function NewCatchPage() {
  const router = useRouter();
  const [editableFields, setEditableFields] = useState<string[]>([]);
  const [isSendCardOpen, setIsSendCardOpen] = useState(false);
  const [isDetailsSaved, setIsDetailsSaved] = useState(false);

  const handleBack = () => router.back();
  const handleOpenSendCard = () => setIsSendCardOpen(true);
  const handleCloseSendCard = () => setIsSendCardOpen(false);

  const handleSaveDetails = async () => {
    const safeAsset = {
      id: newAsset.ID || "",
      species: newAsset.Species || "",
      weight: "0",
      catchLocation: newAsset.CatchLocation || "",
      catchDate: newAsset.CatchDate || "",
      fishingMethod: newAsset.FishingMethod || "",
      fisher: newAsset.Fisher || "",
      supplier: newAsset.Supplier || "",
      sellingLocationSupplier: "",
      retailers: [],
      sellingLocationRetailers: [],
      consumers: [],
    };
  
    try {
      const data = await createAsset(safeAsset);
      console.log("Asset created:", data);
      setIsDetailsSaved(true);
    } catch (error) {
      console.error("Failed to save asset:", error);
    }
  };
  
  

  // New blank asset state
  const [newAsset, setNewAsset] = useState({
    ID: "",
    Species: "",
    CatchLocation: "",
    CatchDate: "",
    FishingMethod: "",
    Fisher: "",
    Supplier: "",
    SupplierLocation: "",
    Retailers: [],
    RetailerLocation: [],
    Consumers: [],
  });

  useEffect(() => {
    const getRoleEditableFields = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const role = userDoc.exists() ? userDoc.data().userType : null;
        if (role) {
          const allowedFields = getEditableFieldsForRole(role);
          setEditableFields(allowedFields);
        }
      }
    };

    getRoleEditableFields();
  }, []);

  // Add this useEffect to fetch and set fisher details
  useEffect(() => {
    const setFisherDetails = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          router.push('/login');
          return;
        }

        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const fisherFormat = `${userData.customId}:${userData.name}`;
          setNewAsset(prev => ({
            ...prev,
            Fisher: fisherFormat
          }));
        }
      } catch (error) {
        console.error("Error setting fisher details:", error);
      }
    };

    setFisherDetails();
  }, []);

  const formattedDetails = [
    { label: "ID", key: "ID", placeholder: "Enter ID", value: newAsset.ID },
    { label: "Species", key: "Species", placeholder: "Set Species", value: newAsset.Species },
    { label: "Catch Location", key: "CatchLocation", placeholder: "Set Catch Location", value: newAsset.CatchLocation },
    { label: "Catch Date", key: "CatchDate", placeholder: "Set Catch Date", value: newAsset.CatchDate },
    { label: "Fishing Method", key: "FishingMethod", placeholder: "Set Fishing Method", value: newAsset.FishingMethod },
    { label: "Fisher", key: "Fisher", placeholder: "Enter Fisher", value: newAsset.Fisher },
    { label: "Supplier", key: "Supplier", placeholder: "Set Supplier", value: newAsset.Supplier },
    { label: "Supplier Location", key: "SupplierLocation", placeholder: "Set Supplier", value: newAsset.SupplierLocation },
    { label: "Retailer", key: "Retailers", placeholder: "Add Retailers", value: newAsset.Retailers.join(", ") },
    { label: "Retailer Location", key: "RetailerLocation", placeholder: "Add Retailers", value: newAsset.RetailerLocation.join(", ") },
    { label: "Consumer", key: "Consumers", placeholder: "Add Consumers", value: newAsset.Consumers.join(", ") },
  ];
  

  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader title="Add New Catch" />
      <main className="min-h-[70vh] bg-[#429FAD] pb-20">
        <div className="w-full h-25 bg-[#429FAD] flex items-center justify-between px-8 pt-6">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="text-white" />
          </Button>
          <div className="bg-white px-6 py-2 shadow-md rounded-md">
            <span className="font-bold text-black">New Asset</span>
          </div>
          <div />
        </div>

        <div className="mx-auto max-w-5xl px-4 my-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <CatchDetailsTable
              assetDetails={[
                { label: "ID", value: newAsset.ID || "Enter ID" },
                { label: "Species", value: newAsset.Species || "Set Species" },
                { label: "Catch Location", value: newAsset.CatchLocation || "Enter Location" },
                { label: "Catch Date", value: newAsset.CatchDate || "Select Date" },
                { label: "Fishing Method", value: newAsset.FishingMethod || "Describe Method" },
                { label: "Fisher", value: newAsset.Fisher || "Loading...", readOnly: true }, // Added readOnly
                { label: "Supplier", value: "NA" },
                { label: "Supplier Location", value: "NA" },
                { label: "Retailer", value: "NA" },
                { label: "Retailer Location", value: "NA" },
                { label: "Consumer", value: "NA" },
              ]}
              editableFields={["ID", "Species", "Catch Location", "Catch Date", "Fishing Method"]} // Removed Fisher
              onChange={(updates) =>
                setNewAsset((prevAsset) => ({
                  ...prevAsset,
                  ...updates,
                }))
              }
            />

          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-evenly">
          <div />
          {!isDetailsSaved ? (
            <SaveAlert
              onSave={handleSaveDetails}
            />
          ) : null}
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
