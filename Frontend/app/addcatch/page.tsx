"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SendCard from "@/components/ui/SendCard";
import CatchDetailsTable from "@/components/CatchTable";
import SaveAlert from "@/components/SaveAlert";
import SendAlert from "@/components/SendAlert";
import HomepageHeader from "@/components/ui/HomepageHeader";
import { getEditableFieldsForRole } from "@/lib/editableFieldsByRole";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase.config";

export default function NewCatchPage() {
  const router = useRouter();
  const [editableFields, setEditableFields] = useState<string[]>([]);
  const [isSendCardOpen, setIsSendCardOpen] = useState(false);
  const [isDetailsSaved, setIsDetailsSaved] = useState(false);

  const handleBack = () => router.back();
  const handleOpenSendCard = () => setIsSendCardOpen(true);
  const handleCloseSendCard = () => setIsSendCardOpen(false);
  const handleSaveDetails = () => setIsDetailsSaved(true);

  // New blank asset state
  const [newAsset, setNewAsset] = useState({
    ID: "Enter ID",
    Species: "Set Species",
    CatchLocation: "Set Catch Location",
    CatchDate: "Set Catch Date",
    FishingMethod: "Set Fishing Method",
    Fisher: "Enter Fisher",
    Supplier: "",
    Retailers: [],
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

  useEffect(() => {
    const setFisherDetails = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const fisherFormat = `${userData.customId}:${userData.name}`;
          setNewAsset(prev => ({
            ...prev,
            Fisher: fisherFormat
          }));
        }
      }
    };

    setFisherDetails();
  }, []);

  const formattedDetails = [
    { label: "ID", value: newAsset.ID },
    { label: "Species", value: newAsset.Species },
    { label: "Catch Location", value: newAsset.CatchLocation },
    { label: "Catch Date", value: newAsset.CatchDate },
    { label: "Fishing Method", value: newAsset.FishingMethod },
    { label: "Fisher", value: newAsset.Fisher },
    { label: "Supplier", value: newAsset.Supplier || "NA" },
    { label: "Retailer", value: newAsset.Retailers.join(", ") || "NA" },
    { label: "Consumer", value: newAsset.Consumers.join(", ") || "NA" },
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
              assetDetails={formattedDetails}
              editableFields={editableFields}
              onChange={(updated) => setNewAsset({ ...newAsset, ...updated })}
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
