import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SignupRoles() {
  return (
    <div className="flex h-screen">
      {/* Left Side (Form) */}
      <div className="w-1/2 flex flex-col justify-center items-center p-8">
        {/* SeaXChange Logo */}
        <h1 className="absolute top-6 left-10 text-2xl font-bold mb-6 text-teal-700">
          SeaXChange
        </h1>
        
        <div className="mb-4">
            <Label htmlFor="userType" className="text-teal-800 text-sm text-l">
                You are a
            </Label>
            <select
                id="userType"
                className="w-full h-16 border border-gray-300 rounded px-4"
            >
                <option value="" disabled selected hidden>
                Select User Type
                </option>
                <option value="">Fisher</option>
                <option value="">Supplier</option>
                <option value="">Retailer</option>
                <option value="">Consumer</option>
            </select>
        </div>
        <Button className="w-lg bg-teal-800 hover:bg-teal-900">
            Submit 
        </Button>
      </div>
      {/* Right Side (Image/Graphic) */}
      <div className="w-1/2 bg-teal-800 flex items-center justify-center text-white">
        <p>Picture/Graphic</p>
      </div>
    </div>
  );
}
