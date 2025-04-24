"use client";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import WarningAlert from "@/components/WarningAlert";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase.config";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields!");
      setOpen(true);
      return false;
    }

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, "users", response.user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userType = userDoc.data().userType;
        if (userType) {
          router.push(`/homepage/${userType}`);
        } else {
          router.push("/auth/signup-roles");
        }
      } else {
        setError("User not found. Please sign-up.");
        setOpen(true);
        router.push("/auth/signup-roles");
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };
  return (
    <div className="flex h-screen">
      {/* ~~~~~ Left Column ~~~~~  */}
      <div className="w-1/2 flex flex-col bg-white p-6">
        {/* SeaXChange Logo */}
        <h1 className="absolute top-10 left-10 text-2xl font-bold mb-6 text-cyan-700 flex items-center">
          <img src="/tuna-logo.png" alt="SeaXChange" className="h-8 mr-2" />
          SeaXChange
        </h1>
        {/* Input Login Details */}
        <form
          className="w-full max-w-sm justify-center items-center mx-auto my-auto"
          onSubmit={(e) => {
            e.preventDefault(); // prevents page reload
            handleLogin();
          }}
        >
          <div className="mb-4">
            <Label htmlFor="email" className="text-cyan-800 text-sm">
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
            <Label htmlFor="password" className="text-cyan-800 text-sm">
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

          <Button
            className="w-full bg-cyan-800 hover:bg-cyan-900 mt-4"
            type="submit"
          >
            Log In
          </Button>

          {error && (
            <WarningAlert message={error} open={open} onOpenChange={setOpen} />
          )}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-cyan-800 underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
      {/* ~~~~~ Right Column ~~~~~  */}
      <div className="w-1/2 bg-cyan-800 flex flex-col justify-center items-center text-white">
        <img
          src="/tuna-background.jpg"
          alt="tuna"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
