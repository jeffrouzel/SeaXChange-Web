"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, ArrowLeft, UserRound, LogOut } from "lucide-react";
import SendCard from "@/components/ui/SendCard";
import CatchDetailsTable from "@/components/CatchTable";

export default function CatchDetailsPage() {
  const [isSendCardOpen, setIsSendCardOpen] = useState(false);

  const handleOpenSendCard = () => setIsSendCardOpen(true);
  const handleCloseSendCard = () => setIsSendCardOpen(false);

  const assetName = "TUNA1";
  const assetDetails = [
    { label: "Species", value: "Skipjack" },
    { label: "Weight (kg)", value: "5.5" },
    { label: "Catch Location", value: "Antique" },
    { label: "Catch Date", value: "2024-12-01" },
    { label: "Fishing Method", value: "Longline" },
    { label: "Vessel", value: "Jagnee" },
    { label: "Supplier", value: "NA" },
    { label: "Retailer", value: "NA" },
    { label: "Consumer", value: "NA" },
  ];

  const editableFields: string[] = [
    "Species",
    "Weight (kg)",
    "Catch Location",
    "Catch Date",
    "Fishing Method",
  ];
  
  return (
    <div className="min-h-screen bg-white">
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-teal-800 font-bold text-lg ml-[150]">SeaXChange</h1>
        <div className="space-x-2 mr-[150] flex justify-center">
          <Button
            variant="outline"
            className="flex flex-col items-center gap-0"
          >
            <UserRound className="w-5 h-5" />
            <Link href="/auth/login">Profile</Link>
          </Button>
          <Button className="flex flex-col items-center text-center gap-0">
            <LogOut className="w-5 h-5" />
            <Link href="/auth/signup">Sign out</Link>
          </Button>
        </div>
      </header>
      <main className="min-h-[70vh] bg-[#429FAD]">
        <div className="w-full h-25 bg-[#429FAD] flex items-center justify-between px-8 pt-[40]">
          <Button variant={"ghost"} size="icon">
            <ArrowLeft className="text-white" />
          </Button>
          <div className="bg-white px-6 py-2 shadow-md rounded-md">
            <span className="font-bold text-black">{assetName}</span>
          </div>
          <div></div>
        </div>

        <div className="mx-[150] my-[40]">
          <CatchDetailsTable
            assetDetails={assetDetails}
            editableFields={editableFields}
          />
        </div>

        <div className="mx-[150] h-16 bg-[#429FAD] flex items-center justify-evenly">
          <div />
          <Button>
            <Link href="/auth/login">Save</Link>
          </Button>
          <Button variant="outline" onClick={handleOpenSendCard}>
            Send Tuna
          </Button>
          <div />
        </div>
      </main>

      {/* Render SendCard modal */}
      {isSendCardOpen && <SendCard onClose={handleCloseSendCard} />}
    </div>
  );
}
