import { WebsiteProjectData } from "@/types/website";
import { createDefaultBirthdayProject } from "./birthday-template";

const baseProject = createDefaultBirthdayProject("demo-birthday", "Ananya", "Rohan & Family");

export const BIRTHDAY_DEMO_PROJECT: WebsiteProjectData = {
  ...baseProject,
  _id: "demo-project-birthday-ananya",
  title: "The Birthday Wonderland — Celebrating Ananya 🎂",
  recipientName: "Ananya",
  senderName: "Rohan & Family",
  status: "published",
  theme: "golden-champagne",
  birthdayDate: "Today",
  age: 25,
};
