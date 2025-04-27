"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase.config";
import { useRouter, usePathname } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // if not logged in, send to login (unless already on an /auth route)
        if (!pathname.startsWith("/auth")) {
          router.replace("/auth/login");
        }
      } else {
        // if logged in and on the root landing page, fetch userType & redirect
        if (pathname === "/") {
          const userSnap = await getDoc(doc(db, "users", user.uid));
          const userType = userSnap.exists() ? userSnap.data().userType : null;
          router.replace(
            userType ? `/homepage/${userType}` : "/auth/signup-roles"
          );
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  // while we’re waiting for Firebase to tell us who’s logged in…
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">Loading…</div>
    );
  }

  return <>{children}</>;
}
