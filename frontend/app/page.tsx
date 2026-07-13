'use client'

import CourseCatalogue from "@/components/main/CourseCatalogue";
import Sidebar from "@/components/shared/Sidebar";
import { useEffect, useState } from "react";
import { extractPayloadFromToken } from "@/lib/auth_v2";
import { jwtDecode } from "jwt-decode";
import LoadingComponent from "@/components/shared/LoadingPage";


export default function Page() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const Cookies = require("js-cookie");
    const access_token = Cookies.get("access_token");

    try {
      const payload = extractPayloadFromToken(access_token);
      console.log("Extracted payload from token:", payload);

      if (payload) { // check payload is not null before accessing its properties
        const newUserId = payload.id;
        const newRole = payload.role;

        setUserId(newUserId);
        setRole(newRole);
      }

    } catch (error) {
      console.error("Error extracting payload from token:", error);
      setLoading(false)
    }

    setLoading(false)
  }, []);

  useEffect(() => {
    if (!userId || !role) {
      console.log("User ID or role is missing. Redirecting to login page.");
    }
  }, [role, userId]);

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <div className="grid grid-cols-4 h-screen">
      <Sidebar />
      <CourseCatalogue userId={userId} role={role} />
    </div>
  )
}
