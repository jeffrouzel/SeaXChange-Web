import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* SeaXChange Logo */}
      <header className="flex justify-between items-center p-4 border-b">
        {/* Logo and Title */}
        <div className="flex items-center">
          <img src="/tuna-logo.png" alt="SeaXChange" className="h-8 w-auto mr-2" />
          <h1 className="text-cyan-700 font-bold text-lg">SeaXChange</h1>
        </div>
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

      <main className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
        <div className="bg-[#348493] flex justify-center items-center text-center p-6">
          <p className="text-2xl font-mono text-[#DDDDDF]">
            “Discover the Journey your tuna made from the ocean to your dinner
            plate”
          </p>
        </div>
        <div className="bg-gray-800 flex items-center justify-start md:justify-center text-white">
          <img
            src="/fisher.jpg"
            alt="fisher-bg"
            className="w-full h-full object-cover"
          />
        </div>
      </main>

      <footer className="text-cyan-700 px-6 py-10 text-sm">
        <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Contact Us */}
          <div>
            <h4 className="font-bold mb-2">Contact Us</h4>
            <ul className="space-y-1">
              <li>Email:</li>
              <li>jabatog@up.edu.ph</li>
              <li>mvcahilig@up.edu.ph</li>
              <li>zfganit@up.edu.ph</li>
              <li>Phone: 09310908177</li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-bold mb-2">Location</h4>
            <p>University of the Philippines Visayas, Miagao, Iloilo, Philippines</p>
          </div>

          {/* Terms */}
          <div>
            <h4 className="font-bold mb-2">Legal</h4>
            <p>Terms of Use (For Academic Use Only)</p>
          </div>
        </div>
      </footer>


    </div>
  );
}
