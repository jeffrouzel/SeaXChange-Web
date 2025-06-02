"use client";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AuthAlert from "@/components/AuthAlerts";

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
  const [autherror, setAuthError] = useState("Login Error");

  const handleLogin = async () => {
    if (!email || !password) {
      setAuthError("Missing Fields");
      setError("Please fill in all fields!");
      setOpen(true);
      if (email && !password) {
        setError("Please enter your password.");
      }
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
          router.push("/auth/signup");
        }
      } else {
        setError("User not found. Please sign-up.");
        setOpen(true);
        setTimeout(() => {
          router.push("/auth/signup-roles");
        }, 2000);
      }
    } catch (err: any) {
      console.error(err.message);
      setAuthError("Login Error");
      if (err.code === "auth/user-not-found") {
        setError("User not found. Please sign-up.");
        setTimeout(() => {
          router.push("/auth/signup-roles");
        }, 2000);
      } else if (err.code === "auth/invalid-credential") {
        setError("Incorrect email or password. Please try again.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError("Unexpected error: " + err.code);
      }
      setOpen(true);
    }
  };
  return (
    <div className="flex h-screen flex-row">
      {/* ~~~~~ Left Column ~~~~~  */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-6 relative">
        {/* SeaXChange Logo */}
        <h1 className="absolute top-10 left-10 text-2xl font-bold mb-6 md:mb-50 sm:mb-50 text-[#348493] flex items-center">
          <img src="/tuna-logo.png" alt="SeaXChange" className="h-8 mr-2" />
          SeaXChange
        </h1>
        {/* Input Login Details */}
        <form
          className="w-full max-w-sm mt-10"
          onSubmit={(e) => {
            e.preventDefault(); // prevents page reload
            handleLogin();
          }}
        >
          <div className="mb-4">
            <Label htmlFor="email" className="text-[#348493] text-sm">
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
            <Label htmlFor="password" className="text-[#348493] text-sm">
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
            className="w-full bg-[#348493] hover:bg-teal-900 mt-4"
            type="submit"
          >
            Log In
          </Button>

          {error && (
            <AuthAlert
              title={autherror}
              message={error}
              open={open}
              onOpenChange={setOpen}
            />
          )}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-[#348493] underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>

      {/* ~~~~~ Right Column (Hide on mobile) ~~~~~ */}
      <div className="hidden md:flex w-1/2 bg-[#348493] justify-center items-center text-white">
        <img
          src="/tuna-background.jpg"
          alt="tuna"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
