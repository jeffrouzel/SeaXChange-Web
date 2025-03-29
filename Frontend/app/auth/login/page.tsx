import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <div className="flex h-screen">
      {/* ~~~~~ Left Column ~~~~~  */}
      <div className="w-1/2 flex flex-col bg-white p-6">
        {/* SeaXChange Logo */}
        <h1 className="absolute top-10 left-10 text-2xl font-bold mb-6 text-teal-700 flex items-center">
          <img src="/tuna-logo.png" alt="SeaXChange" className="h-8 mr-2" />
          SeaXChange
        </h1>
        {/* Input Login Details */}
        <form className="w-full max-w-sm justify-center items-center mx-auto my-auto">
          <div className="mb-4">
            <Label htmlFor="email" className="text-teal-800 text-sm">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full h-16"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="password" className="text-teal-800 text-sm">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full h-16"
            />
          </div>

          <Button className="w-full bg-teal-800 hover:bg-teal-900 mt-4">
            Log In
          </Button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-teal-800 underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
      {/* ~~~~~ Right Column ~~~~~  */}
      <div className="w-1/2 bg-teal-800 flex flex-col justify-center items-center text-white">
        <img src="/tuna-background.jpg" alt="tuna" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
