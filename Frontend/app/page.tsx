import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* SeaXChange Logo */}
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-teal-800 font-bold text-lg flex items-center">
          <img src="/tuna-logo.png" alt="SeaXChange" className="h-8 mr-2" />
          SeaXChange
        </h1>
        {/* Login and Register */}
        <div className="space-x-2">
          <Button variant="outline">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button>
            <Link href="/auth/signup">Getting Started</Link>
          </Button>
        </div>
      </header>

      <main className="grid grid-cols-2 min-h-[70vh]">
        <div className="bg-gray-200 flex justify-center items-center text-center p-6">
          <p className="text-lg font-mono">
            “Discover the Journey your tuna made from the ocean to your dinner
            plate”
          </p>
        </div>
        <div className="bg-teal-800 flex justify-center items-center text-white">
          <img src="/tuna-background.jpg" alt="tuna" className="w-full h-full object-cover" />       
        </div>
      </main>

      <footer className="text-center py-6 text-teal-800">Some Footer</footer>
    </div>
  );
}
