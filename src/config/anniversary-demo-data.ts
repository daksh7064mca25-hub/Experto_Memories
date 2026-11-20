import { WebsiteProjectData, AnniversaryThemeId } from "@/types/website";
import { createDefaultAnniversaryProject } from "./anniversary-template";

export const ANNIVERSARY_DEMO_PROJECT_BASE: WebsiteProjectData = {
  ...createDefaultAnniversaryProject("demo-anniversary", "Sophia", "Lucas"),
  _id: "demo-project-anniversary-sophia",
  title: "Our Forever Story — Sophia & Lucas",
  recipientName: "Sophia",
  senderName: "Lucas",
  partner1Name: "Sophia",
  partner2Name: "Lucas",
  status: "published",
  theme: "pink-paradise",
  anniversaryDate: "October 14th",
  relationshipStartDate: "October 14, 2021",
  yearsTogether: 3,
};

/**
 * Creates an isolated in-memory copy of the Anniversary Demo project.
 * Guaranteed to never write to or read from MongoDB or real customer projects.
 */
export function createAnniversaryDemoProject(theme: AnniversaryThemeId = "pink-paradise"): WebsiteProjectData {
  const cloned: WebsiteProjectData = JSON.parse(JSON.stringify(ANNIVERSARY_DEMO_PROJECT_BASE));
  cloned.theme = theme;
  return cloned;
}
