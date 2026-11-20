"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudioCreateRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect customer creation to customer workspace
    router.replace("/dashboard/create");
  }, [router]);

  return (
    <div className="min-h-[300px] flex items-center justify-center text-stone-500 font-sans text-xs">
      Redirecting to Customer Creation Workspace...
    </div>
  );
}
