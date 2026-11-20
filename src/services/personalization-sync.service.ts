import { WebsiteProject } from "@/models/WebsiteProject";
import { IOrderDoc } from "@/models/Order";
import { WebsiteSectionData } from "@/types/website";

/**
 * Synchronizes customer personalization into the already provisioned WebsiteProject.
 * Strictly preserves the existing theme, animations, styling, and section order.
 */
export async function syncPersonalizationToProject(order: IOrderDoc): Promise<{
  success: boolean;
  projectId?: string;
  projectSlug?: string;
  error?: string;
}> {
  if (!order.projectId) {
    return {
      success: false,
      error: "No WebsiteProject is linked to this order yet.",
    };
  }

  const project = await WebsiteProject.findById(order.projectId);
  if (!project) {
    return {
      success: false,
      error: `Linked project '${order.projectId}' could not be found in the database.`,
    };
  }

  const p: any = order.personalization || {};
  const occasionType = project.occasionType || order.items[0]?.occasionType || "apology";

  // 1. Update Core Metadata
  if (p.recipientName) project.recipientName = p.recipientName.trim();
  if (p.senderName) project.senderName = p.senderName.trim();
  if (p.partner1Name) project.partner1Name = p.partner1Name.trim();
  if (p.partner2Name) project.partner2Name = p.partner2Name.trim();
  if (p.occasionDate) project.anniversaryDate = p.occasionDate.trim();
  if (p.relationshipStartDate) project.relationshipStartDate = p.relationshipStartDate.trim();
  if (p.yearsTogether !== undefined) project.yearsTogether = Number(p.yearsTogether);

  // 2. Audio Settings
  if (p.audioTrackUrl) {
    project.audioSettings = {
      ...project.audioSettings,
      enabled: true,
      backgroundMusicUrl: p.audioTrackUrl,
      title: project.audioSettings?.title || "Special Song for You",
    };
  }

  // 3. Map Sections Without Wiping Structure
  const updatedSections: WebsiteSectionData[] = (project.sections || []).map((sec: any) => {
    const secObj = typeof sec.toObject === "function" ? sec.toObject() : sec;
    const config = { ...(secObj.config || {}) };

    // Apology Sections
    if (secObj.type === "letter") {
      if (p.letter) {
        // Split multi-paragraph letter cleanly by double newlines or single newlines
        const paragraphs = p.letter
          .split(/\n\s*\n/)
          .map((para: string) => para.trim())
          .filter(Boolean);
        config.paragraphs = paragraphs.length > 0 ? paragraphs : [p.letter.trim()];
      }
      if (p.recipientName) {
        config.salutation = `My Dearest ${p.recipientName},`;
      }
      if (p.senderName) {
        config.signoff = `Forever yours, ${p.senderName}`;
      }
    }

    if (secObj.type === "memories") {
      const photoItems = (p.mediaItems || []).filter((m: any) => m.type === "image" || !m.type);
      if (photoItems.length > 0) {
        config.photos = photoItems.map((item: any, idx: number) => ({
          id: `cust-photo-${idx + 1}`,
          url: item.url,
          caption: item.caption || `Cherished Memory #${idx + 1}`,
          date: p.occasionDate || "Our special time",
          rotation: (idx % 2 === 0 ? -1 : 1) * ((idx % 3) + 1),
        }));
      }
    }

    if (secObj.type === "promises" && Array.isArray(p.promises) && p.promises.length > 0) {
      config.promises = p.promises.map((prom: any, idx: number) => ({
        id: `cust-prom-${idx + 1}`,
        title: prom.title,
        description: prom.description,
        icon: "heart",
      }));
    }

    if (secObj.type === "reasons" && Array.isArray(p.notes) && p.notes.length > 0) {
      config.items = p.notes.map((note: string, idx: number) => ({
        id: `cust-reason-${idx + 1}`,
        text: note,
        icon: "sparkles",
      }));
    }

    // Anniversary / Love / Birthday Sections
    if (secObj.type === "anniversary_intro") {
      if (p.partner1Name && p.partner2Name) {
        config.coupleNames = `${p.partner1Name} & ${p.partner2Name}`;
      } else if (p.recipientName && p.senderName) {
        config.coupleNames = `${p.recipientName} & ${p.senderName}`;
      }
      if (p.occasionDate) {
        config.anniversaryDate = p.occasionDate;
      }
      if (p.yearsTogether) {
        config.yearsTogetherText = `${p.yearsTogether} Beautiful Years`;
      }
    }

    if (secObj.type === "anniversary_gallery") {
      const photoItems = (p.mediaItems || []).filter((m: any) => m.type === "image" || !m.type);
      if (photoItems.length > 0) {
        config.photos = photoItems.map((item: any, idx: number) => ({
          id: `anniv-cust-photo-${idx + 1}`,
          url: item.url,
          caption: item.caption || `Our beautiful moment #${idx + 1}`,
          date: p.occasionDate || "Together",
        }));
      }
    }

    if (secObj.type === "anniversary_timeline" && p.occasionDate) {
      const milestones = Array.isArray(config.milestones) ? [...config.milestones] : [];
      if (milestones.length > 0) {
        // Update current anniversary date in the last milestone
        milestones[milestones.length - 1] = {
          ...milestones[milestones.length - 1],
          date: p.occasionDate,
        };
        config.milestones = milestones;
      }
    }

    return {
      ...secObj,
      config,
    };
  });

  project.sections = updatedSections as any;
  await project.save();

  return {
    success: true,
    projectId: project._id.toString(),
    projectSlug: project.slug,
  };
}
