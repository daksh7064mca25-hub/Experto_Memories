import { WebsiteProjectData } from "@/types/website";
import { createDefaultLoveProject } from "./love-template";

const baseLove = createDefaultLoveProject("demo-love", "Riya", "Arjun");

export const LOVE_DEMO_PROJECT: WebsiteProjectData = {
  ...baseLove,
  slug: "demo-love",
  title: "The Secret World of Us — Riya & Arjun ❤️",
  recipientName: "Riya",
  senderName: "Arjun",
  occasionType: "love",
  theme: "burgundy-velvet",
  status: "published",
  paymentStatus: "paid",
  paidAt: new Date().toISOString(),
};
