import { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { projectService } from "@/services/project.service";
import { toClientProjectDTO } from "@/lib/project-dto";
import { getAdminSession, getCustomerSession, verifyWebsiteUnlockToken } from "@/lib/auth";
import { ApologyRenderer } from "@/components/apology/ApologyRenderer";
import { AnniversaryRenderer } from "@/components/anniversary/AnniversaryRenderer";
import { BirthdayRenderer } from "@/components/birthday/BirthdayRenderer";
import { LoveRenderer } from "@/components/love/LoveRenderer";
import { WeddingRenderer } from "@/components/wedding/WeddingRenderer";
import { PasswordGateView } from "@/components/common/PasswordGateView";
import Link from "next/link";
import { Heart, Sparkles, ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await projectService.getBySlug(slug);

  if (!project) {
    return {
      title: "Gift Not Found | ExpertoMemories",
    };
  }

  if (project.occasionType === "wedding") {
    const title = project.title || `The Wedding Celebration of ${project.recipientName} 💍`;
    const description = `You are cordially invited to celebrate the royal wedding of ${project.recipientName}. View the sacred celebrations agenda, venue map, and RSVP online.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
      },
    };
  }

  if (project.occasionType === "birthday") {
    const title = project.title || `Happy Birthday, ${project.recipientName}! 🎂✨`;
    const description = `A magical personalized birthday celebration created with love by ${project.senderName}.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
      },
    };
  }

  if (project.occasionType === "love") {
    const title = project.title || `The Secret World of Us — ${project.recipientName} & ${project.senderName} ❤️`;
    const description = `A private romantic universe created exclusively for ${project.recipientName} by ${project.senderName}.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
      },
    };
  }

  // Check occasion type: default to apology for backward compatibility
  if (project.occasionType === "anniversary") {
    const p1 = project.partner1Name || project.recipientName || "My Love";
    const p2 = project.partner2Name || project.senderName || "Forever Love";
    const title = project.title || `Our Forever Story — ${p1} & ${p2}`;
    const description = `A personalized interactive anniversary journey celebrating every beautiful chapter of ${p1} & ${p2}.`;

    return {
      title,
      description,
      openGraph: {
        title: `Our Forever Story — Celebrating Us ❤️`,
        description,
        type: "website",
      },
    };
  }

  return {
    title: `A Little Sorry, A Lot of Love for ${project.recipientName}`,
    description: `A personalized interactive digital apology created with love by ${project.senderName}.`,
    openGraph: {
      title: `A Message for ${project.recipientName} ❤️`,
      description: `Someone has something special to tell you...`,
      type: "website",
    },
  };
}

export default async function GiftSlugPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreviewRequested = preview === "true";

  const project = await projectService.getBySlug(slug);

  if (!project) {
    notFound();
  }

  // Security check: Studio admin OR customer owner can preview unpublished draft
  let isAuthorizedPreview = false;
  if (isPreviewRequested) {
    const adminSession = await getAdminSession();
    if (adminSession && adminSession.role === "admin") {
      isAuthorizedPreview = true;
    } else {
      const customerSession = await getCustomerSession();
      if (
        customerSession &&
        (String(project.customerId || "") === customerSession.userId ||
          (project.customerEmail &&
            project.customerEmail.toLowerCase() === customerSession.email.toLowerCase()))
      ) {
        isAuthorizedPreview = true;
      }
    }
  }

  // If not published and not an authorized preview, do not show public
  if (project.status !== "published" && !isAuthorizedPreview) {
    const isAnniversary = project.occasionType === "anniversary";

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-pink-50 text-center font-sans">
        <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-rose-500 mb-4 shadow-sm">
          <Heart size={32} className="fill-rose-400" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-rose-950 mb-2">
          This Gift Is Currently Private
        </h1>
        <p className="text-sm text-stone-600 max-w-md mb-6 leading-relaxed">
          {isAnniversary
            ? "The creator is still adding loving touches to this anniversary celebration. Check back soon!"
            : "The sender is still putting the final touches of love on this experience. Check back soon!"}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-rose-500 text-white shadow-md hover:bg-rose-600 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Return Home</span>
        </Link>
      </div>
    );
  }

  // Password Protection Gate:
  // If project is password protected, verify cryptographically signed unlock token unless authorized preview
  if (project.isPasswordProtected && project.passwordHash && !isAuthorizedPreview) {
    const cookieStore = await cookies();
    const unlockToken =
      cookieStore.get(`em_unlock_${slug}`)?.value ||
      cookieStore.get(`em_unlocked_${slug}`)?.value ||
      "";
    const isUnlocked = await verifyWebsiteUnlockToken(unlockToken, slug);
    if (!isUnlocked) {
      return (
        <PasswordGateView
          slug={project.slug}
          recipientName={project.recipientName}
          senderName={project.senderName}
          passwordHint={project.passwordHint}
        />
      );
    }
  }

  // Birthday Scratch Surprise: Resolve and persist random reward if Mode B (Random Surprise)
  if (project.occasionType === "birthday" && Array.isArray(project.sections)) {
    const gameSection = project.sections.find((s) => s.type === "birthday_game");
    if (gameSection && gameSection.config) {
      const gameConfig = gameSection.config;
      if (gameConfig.mode === "random") {
        const pool = Array.isArray(gameConfig.randomRewards) && gameConfig.randomRewards.length > 0
          ? gameConfig.randomRewards.filter((r: any) => r.enabled !== false)
          : Array.isArray(gameConfig.surprises) && gameConfig.surprises.length > 0
          ? gameConfig.surprises.filter((s: any) => s.enabled !== false)
          : [];

        if (pool.length > 0) {
          let chosen = pool.find((r: any) => r.id === gameConfig.selectedRewardId);
          let needsPersist = false;

          if (!chosen) {
            // First time opened by visitor: pick deterministic reward from candidate pool based on project identity
            let hash = 0;
            const seed = String(project._id || project.slug || "");
            for (let i = 0; i < seed.length; i++) {
              hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
            }
            const selectedIdx = pool.length > 0 ? hash % pool.length : 0;
            chosen = pool[selectedIdx];
            gameConfig.selectedRewardId = chosen.id;
            needsPersist = true;
          }

          if (chosen && (!gameConfig.revealedReward || needsPersist)) {
            gameConfig.revealedReward = {
              id: chosen.id,
              title: chosen.title,
              description: chosen.description || "",
              redemptionInstructions:
                chosen.redemptionInstructions || "Show this card to the sender anytime to claim your surprise!",
              icon: chosen.icon || "gift",
              badge: chosen.badge || "Special Treat",
              category: chosen.category || "experience",
              enabled: true,
            };
          }

          if (needsPersist) {
            try {
              await projectService.update(project._id || project.slug, {
                sections: project.sections,
              });
            } catch (err) {
              console.error("Failed to persist selected birthday scratch reward:", err);
            }
          }
        }
      }
    }
  }

  // Serialize project to clean, safe Client Component DTO
  // Strips passwordHash, converts ObjectIds & Dates, removes non-plain prototypes
  const clientProject = toClientProjectDTO(project);

  // Conceal unselected candidate rewards from public client payload for Mode B
  if (
    clientProject.occasionType === "birthday" &&
    !isAuthorizedPreview &&
    Array.isArray(clientProject.sections)
  ) {
    const clientGameSec = clientProject.sections.find((s) => s.type === "birthday_game");
    if (clientGameSec && clientGameSec.config && clientGameSec.config.mode === "random") {
      delete clientGameSec.config.randomRewards;
      if (Array.isArray(clientGameSec.config.surprises) && clientGameSec.config.surprises.length > 1) {
        if (clientGameSec.config.revealedReward) {
          clientGameSec.config.surprises = [clientGameSec.config.revealedReward];
        }
      }
    }
  }

  // Dynamic Product Dispatch:
  // occasionType === "wedding" -> WeddingRenderer (Digital Wedding Invitations)
  // occasionType === "birthday" -> BirthdayRenderer (The Birthday Wonderland)
  // occasionType === "love" -> LoveRenderer (The Secret World of Us)
  // occasionType === "anniversary" -> AnniversaryRenderer (Our Love Story)
  // occasionType === "apology" or undefined -> ApologyRenderer (full backward compatibility)
  if (clientProject.occasionType === "wedding") {
    return <WeddingRenderer project={clientProject} previewMode={false} />;
  }

  if (clientProject.occasionType === "birthday") {
    return <BirthdayRenderer project={clientProject} previewMode={false} />;
  }

  if (clientProject.occasionType === "love") {
    return <LoveRenderer project={clientProject} previewMode={false} />;
  }

  if (clientProject.occasionType === "anniversary") {
    return <AnniversaryRenderer project={clientProject} previewMode={false} />;
  }

  return <ApologyRenderer project={clientProject} previewMode={false} />;
}

