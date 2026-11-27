"use client";

import { use, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface Props {
  params?: Promise<{ id: string }> | { id: string };
}

export default function StudioEditorLegacyRedirect({ params }: Props) {
  const router = useRouter();
  const routeParams = useParams();

  let idFromProps = "";
  if (params) {
    if (typeof (params as any).then === "function") {
      const resolved = use(params as Promise<{ id: string }>);
      if (resolved && resolved.id) idFromProps = resolved.id;
    } else if (typeof params === "object" && (params as any).id) {
      idFromProps = (params as any).id;
    }
  }

  const id =
    idFromProps ||
    (typeof routeParams?.id === "string"
      ? routeParams.id
      : Array.isArray(routeParams?.id)
      ? routeParams.id[0]
      : "") ||
    "";

  useEffect(() => {
    if (id) {
      router.replace(`/editor/${id}`);
    }
  }, [id, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-600 font-serif text-sm">
      Opening Customer Visual Editor...
    </div>
  );
}
