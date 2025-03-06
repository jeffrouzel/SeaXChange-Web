import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil, ArrowLeft, UserRound, LogOut } from "lucide-react";

export default function CatchDetails() {
  return (
    <div className="min-h-screen bg-white">
      {/* SeaXChange Logo */}
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-teal-800 font-bold text-lg ml-[150]">SeaXChange</h1>
        {/* Profile and SignOut */}
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
        <div className=" w-full h-25 bg-[#429FAD] flex items-center justify-between px-8 pt-[40]">
          {/* Arrow Back Button */}
          <Button variant={"ghost"} size="icon">
            <ArrowLeft className="text-white" />
          </Button>
          {/* ASSET NAME */}
          <div className="bg-white px-6 py-2 shadow-md rounded-md">
            <span className="font-bold text-black">TUNA1</span>
          </div>
          {/* Empty Space to Balance */}
          <div></div>
        </div>
        {/* Asset Details */}
        <div className="mx-[150] my-[40] bg-white shadow-lg">
          {/* Table Rows */}
          {[
            { label: "Species", value: "Skipjack", editable: true },
            { label: "Weight (kg)", value: "5.5", editable: true },
            { label: "Catch Location", value: "Antique", editable: true },
            { label: "Catch Date", value: "2024-12-01", editable: true },
            { label: "Fishing Method", value: "Longline", editable: true },
            { label: "Vessel", value: "Jagnee", editable: false },
            { label: "Supplier", value: "NA", editable: false },
            { label: "Retailer", value: "NA", editable: false },
            { label: "Consumer", value: "NA", editable: false },
          ].map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b last:border-b-0 px-4 py-3"
            >
              <span className="font-medium">{item.label}</span>
              <div className="flex items-center gap-2">
                <span>{item.value}</span>
                {item.editable && (
                  <Button variant={"ghost"} size="icon">
                    <Pencil
                      className="w-4 h-4 text-black-500 cursor-pointer"
                      strokeWidth={3}
                    />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mx-[150] h-16 bg-[#429FAD] flex items-center justify-evenly">
          <div />
          <Button>
            <Link href="/auth/login">Save</Link>
          </Button>
          <Button variant="outline">
            <Link href="/auth/signup">Send Tuna</Link>
          </Button>
          <div />
        </div>
      </main>
    </div>
  );
}
