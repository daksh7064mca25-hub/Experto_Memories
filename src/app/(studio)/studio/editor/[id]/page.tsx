"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default function StudioEditorLegacyRedirect({ params }: Props) {
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    router.replace(`/editor/${id}`);
  }, [id, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-600 font-serif text-sm">
      Opening Customer Visual Editor...
    </div>
  );
}
