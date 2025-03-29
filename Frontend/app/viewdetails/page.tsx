import Link from "next/link";
import HomepageHeader from "@/components/ui/HomepageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserRound, LogOut } from "lucide-react";
import CatchDetailsTable from "@/components/CatchTable";

export default function CatchDetailsPage() {
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

  const editableFields = [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <HomepageHeader />
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

        <div className="mx-[150] h-16 bg-[#429FAD] flex items-center justify-evenly"></div>
      </main>
    </div>
  );
}
