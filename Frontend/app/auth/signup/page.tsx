"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/firebase.config";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/auth/signup-roles");
    } catch (error) {
      console.error("Error signing up:", error);
      setError("Failed to sign up. Please try again.");
    }
  };
  return (
    <div className="flex h-screen">
      {/* Left Side (Form) */}
      <div className="w-1/2 flex flex-col justify-center items-center p-8">
        {/* SeaXChange Logo */}
        <h1 className="absolute top-6 left-10 text-2xl font-bold mb-6 text-teal-700">
          SeaXChange
        </h1>
        <form
          className="w-full max-w-sm"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignUp();
          }}
        >
          <div className="mb-4">
            <Label htmlFor="email" className="text-teal-800 text-sm">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full h-16"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {/* <Button className="w-full bg-teal-800 hover:bg-teal-900 mt-4">
            Sign Up
          </Button> */}
          <Button
            type="button"
            onClick={handleSignUp}
            className="w-full bg-teal-800 hover:bg-teal-900 mt-4"
          >
            Sign Up
          </Button>
        </form>
        <p className="mt-4 text-gray-500">or sign up with</p>
        <div className="flex space-x-4 mt-2">
          <button className="border border-teal-700 p-2 w-20 h-12 rounded">
            Google
          </button>
        </div>
        <p className="absolute bottom-10 left-4 mt-4 text-gray-500">
          Have an account?{" "}
          <Link href="/auth/login" className="text-teal-700 underline">
            Log in
          </Link>
        </p>
      </div>
      {/* Right Side (Image/Graphic) */}
      <div className="w-1/2 bg-teal-800 flex items-center justify-center text-white">
        <p>Picture/Graphic</p>
      </div>
    </div>
  );
}
