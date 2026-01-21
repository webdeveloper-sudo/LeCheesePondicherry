"use client";
import { auth, db } from "@/lib/firebase";
import { useEffect } from "react";

export default function TestFirebase() {
  useEffect(() => {
    console.log("Auth object:", auth);
    console.log("Firestore object:", db);
  }, []);

  return <div>Firebase test page. Check console.</div>;
}
