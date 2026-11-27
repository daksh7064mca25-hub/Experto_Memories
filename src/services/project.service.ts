import { connectToDatabase } from "@/lib/mongodb";
import { WebsiteProject } from "@/models/WebsiteProject";
import { WebsiteProjectData } from "@/types/website";
import { createDefaultProject } from "@/config/default-template";
import { createDefaultAnniversaryProject } from "@/config/anniversary-template";
import { createDefaultBirthdayProject, createRelationshipBirthdayProject } from "@/config/birthday-template";
import { createDefaultLoveProject } from "@/config/love-template";
import { createDefaultWeddingProject } from "@/config/wedding-template";
import { hashPassword } from "@/lib/auth";

const isProduction = () => process.env.NODE_ENV === "production" && process.env.ALLOW_IN_MEMORY_TEST !== "true";

// In-memory fallback repository strictly for local development and offline test suites
const getMemoryStore = (): Map<string, WebsiteProjectData> => {
  if (isProduction()) {
    throw new Error("Fatal: Attempted to use in-memory store in production environment.");
  }

  if (!(globalThis as any)._memoryProjectStore) {
    const store = new Map<string, WebsiteProjectData>();
    const defaultDemo = createDefaultProject("sarah-love", "Sarah", "Alex");
    defaultDemo._id = "demo-project-sarah";
    defaultDemo.status = "published";
    store.set(defaultDemo.slug, defaultDemo);

    const emilyDemo = createDefaultProject("emily-sweet", "Emily", "Noah");
    emilyDemo._id = "demo-project-emily";
    emilyDemo.theme = "lavender-dreams";
    emilyDemo.status = "published";
    store.set(emilyDemo.slug, emilyDemo);

    (globalThis as any)._memoryProjectStore = store;
  }
  return (globalThis as any)._memoryProjectStore;
};

export const projectService = {
  async getAll(): Promise<WebsiteProjectData[]> {
    const conn = await connectToDatabase();
    if (conn) {
      const docs = await WebsiteProject.find().sort({ updatedAt: -1 }).lean();
      return (docs || []).map((d: any) => ({
        ...d,
        _id: d._id?.toString() || d._id,
        customerId: d.customerId?.toString() || d.customerId,
        orderId: d.orderId?.toString() || d.orderId,
        occasionType: d.occasionType || "apology",
      }));
    }

    if (isProduction()) {
      throw new Error("Database connection required to fetch projects.");
    }

    const store = getMemoryStore();
    return Array.from(store.values()).sort(
      (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
    );
  },

  async getByCustomer(customerId: string, customerEmail?: string): Promise<WebsiteProjectData[]> {
    const conn = await connectToDatabase();
    if (conn) {
      const orConditions: any[] = [];
      if (customerId) {
        orConditions.push({ customerId });
        try {
          const mongoose = await import("mongoose");
          if (mongoose.default?.Types?.ObjectId?.isValid(customerId) || (mongoose as any).Types?.ObjectId?.isValid(customerId)) {
            const ObjectId = mongoose.default?.Types?.ObjectId || (mongoose as any).Types?.ObjectId;
            orConditions.push({ customerId: new ObjectId(customerId) });
          }
        } catch {}
      }
      if (customerEmail && customerEmail.trim()) {
        orConditions.push({ customerEmail: customerEmail.toLowerCase().trim() });
      }

      if (orConditions.length === 0) {
        return [];
      }

      const docs = await WebsiteProject.find({ $or: orConditions })
        .sort({ updatedAt: -1 })
        .lean();
      return (docs || []).map((d: any) => ({
        ...d,
        _id: d._id?.toString() || d._id,
        customerId: d.customerId?.toString() || d.customerId,
        orderId: d.orderId?.toString() || d.orderId,
        occasionType: d.occasionType || "apology",
      }));
    }

    if (isProduction()) {
      throw new Error("Database connection required to fetch customer projects.");
    }

    const store = getMemoryStore();
    return Array.from(store.values())
      .filter(
        (p) =>
          p.customerId === customerId ||
          (customerEmail && p.customerEmail?.toLowerCase() === customerEmail.toLowerCase())
      )
      .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
  },

  async isSlugAvailable(slug: string, excludeProjectId?: string): Promise<boolean> {
    const conn = await connectToDatabase();
    if (conn) {
      const query: any = { slug };
      if (excludeProjectId) {
        try {
          query._id = { $ne: excludeProjectId };
        } catch {
          // not valid ObjectId
        }
      }
      const existing = await WebsiteProject.findOne(query).lean();
      return !existing;
    }
    const store = getMemoryStore();
    const existing = store.get(slug);
    if (!existing) return true;
    if (excludeProjectId && (existing._id === excludeProjectId || existing.slug === excludeProjectId)) {
      return true;
    }
    return false;
  },

  async getBySlug(slug: string): Promise<WebsiteProjectData | null> {
    if (slug === "demo-wedding" || slug.startsWith("demo-wedding")) {
      const suffix = slug.replace(/^demo-wedding-?/, "") || "royal-indian";
      const demo = createDefaultWeddingProject(slug, undefined, undefined, suffix);
      demo._id = `demo-wedding-${suffix || "royal"}-id`;
      demo.status = "published";
      return demo;
    }

    const conn = await connectToDatabase();
    if (conn) {
      const doc = await WebsiteProject.findOne({ slug }).lean();
      if (!doc) return null;
      return {
        ...(doc as any),
        _id: (doc as any)._id?.toString() || (doc as any)._id,
        customerId: (doc as any).customerId?.toString() || (doc as any).customerId,
        orderId: (doc as any).orderId?.toString() || (doc as any).orderId,
        occasionType: (doc as any).occasionType || "apology",
      };
    }

    if (isProduction()) {
      throw new Error("Database connection required to fetch project by slug.");
    }

    return getMemoryStore().get(slug) || null;
  },

  async getById(id: string): Promise<WebsiteProjectData | null> {
    const conn = await connectToDatabase();
    if (conn) {
      let doc = null;
      // Try Mongoose ObjectId lookup first, fallback to slug lookup
      try {
        doc = await WebsiteProject.findById(id).lean();
      } catch {
        // id was not a valid 24-char hex ObjectId; attempt slug lookup
      }
      if (!doc) {
        doc = await WebsiteProject.findOne({ slug: id }).lean();
      }
      if (!doc) return null;

      return {
        ...(doc as any),
        _id: (doc as any)._id?.toString() || (doc as any)._id,
        customerId: (doc as any).customerId?.toString() || (doc as any).customerId,
        orderId: (doc as any).orderId?.toString() || (doc as any).orderId,
        occasionType: (doc as any).occasionType || "apology",
      };
    }

    if (isProduction()) {
      throw new Error("Database connection required to fetch project by ID.");
    }

    const store = getMemoryStore();
    for (const project of store.values()) {
      if (project._id === id || project.slug === id) {
        return project;
      }
    }
    return null;
  },

  async create(data: Partial<WebsiteProjectData>): Promise<WebsiteProjectData> {
    const conn = await connectToDatabase();
    const occasionType = data.occasionType || "apology";
    const slugPrefix =
      occasionType === "anniversary"
        ? "forever"
        : occasionType === "wedding"
        ? "wedding"
        : occasionType;
    const slug = data.slug || `${slugPrefix}-${Math.random().toString(36).substring(2, 7)}`;
    
    let base: WebsiteProjectData;
    let defaultTheme = "cotton-candy";

    if (occasionType === "wedding") {
      const bride = data.weddingDetails?.brideName || data.partner1Name || "Roshni";
      const groom = data.weddingDetails?.groomName || data.partner2Name || "Aarav";
      const collection = data.weddingDetails?.collection || data.subcategoryId || "royal-indian";
      base = createDefaultWeddingProject(slug, bride, groom, collection);
      defaultTheme = (base.theme as string) || "royal-crimson";
    } else if (occasionType === "birthday") {
      base = createRelationshipBirthdayProject(
        slug,
        data.recipientName || "Ananya",
        data.senderName || "Someone Special",
        data.recipientType || "general",
        data.age || 25
      );
      defaultTheme = (base.theme as string) || "golden-champagne";
    } else if (occasionType === "love") {
      base = createDefaultLoveProject(
        slug,
        data.recipientName || data.partner1Name || "Maya",
        data.senderName || data.partner2Name || "Dev"
      );
      defaultTheme = "burgundy-velvet";
    } else if (occasionType === "anniversary") {
      base = createDefaultAnniversaryProject(
        slug,
        data.partner1Name || data.recipientName || "Olivia",
        data.partner2Name || data.senderName || "Liam"
      );
      defaultTheme = "pink-paradise";
    } else {
      base = createDefaultProject(
        slug,
        data.recipientName || "Loved One",
        data.senderName || "Me"
      );
      defaultTheme = "cotton-candy";
    }
    
    const newProject: WebsiteProjectData = {
      ...base,
      ...data,
      slug,
      occasionType,
      theme: data.theme || (defaultTheme as any),
      status: data.status || "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (conn) {
      const created = await WebsiteProject.create(newProject);
      newProject._id = created._id.toString();
      return newProject;
    }

    if (isProduction()) {
      throw new Error("Database connection required to create persistent project.");
    }

    newProject._id = `mem-${Date.now()}`;
    getMemoryStore().set(slug, newProject);
    return newProject;
  },

  async update(id: string, updates: Partial<WebsiteProjectData>): Promise<WebsiteProjectData | null> {
    const conn = await connectToDatabase();
    const updatedPayload: any = {
      ...updates,
      updatedAt: new Date(),
    };

    if ((updates as any).password) {
      updatedPayload.passwordHash = await hashPassword((updates as any).password);
      delete updatedPayload.password;
    }

    if (conn) {
      let doc = null;
      try {
        doc = await WebsiteProject.findByIdAndUpdate(id, updatedPayload, { new: true }).lean();
      } catch {
        // id was not a valid 24-char hex ObjectId; attempt slug update
      }
      if (!doc) {
        doc = await WebsiteProject.findOneAndUpdate({ slug: id }, updatedPayload, { new: true }).lean();
      }

      if (!doc) return null;
      return {
        ...(doc as any),
        _id: (doc as any)._id?.toString() || (doc as any)._id,
        customerId: (doc as any).customerId?.toString() || (doc as any).customerId,
        orderId: (doc as any).orderId?.toString() || (doc as any).orderId,
        occasionType: (doc as any).occasionType || "apology",
      };
    }

    if (isProduction()) {
      throw new Error("Database connection required to update project.");
    }

    // Memory update for dev/test
    const store = getMemoryStore();
    for (const [slug, proj] of store.entries()) {
      if (proj._id === id || proj.slug === id) {
        const merged = { ...proj, ...updatedPayload };
        store.set(slug, merged);
        if (updates.slug && updates.slug !== slug) {
          store.delete(slug);
          store.set(updates.slug, merged);
        }
        return merged;
      }
    }
    return null;
  },

  async delete(id: string): Promise<boolean> {
    const conn = await connectToDatabase();
    if (conn) {
      let result = null;
      try {
        result = await WebsiteProject.findByIdAndDelete(id);
      } catch {
        // Attempt deletion by slug if not a valid ObjectId
      }
      if (!result) {
        result = await WebsiteProject.findOneAndDelete({ slug: id });
      }
      return Boolean(result);
    }

    if (isProduction()) {
      throw new Error("Database connection required to delete project.");
    }

    const store = getMemoryStore();
    for (const [slug, proj] of store.entries()) {
      if (proj._id === id || proj.slug === id) {
        store.delete(slug);
        return true;
      }
    }
    return true;
  },

  async duplicate(id: string): Promise<WebsiteProjectData | null> {
    const source = await this.getById(id);
    if (!source) return null;

    const newSlug = `${source.slug}-copy-${Math.random().toString(36).substring(2, 5)}`;
    const cloned: Partial<WebsiteProjectData> = {
      ...JSON.parse(JSON.stringify(source)),
      _id: undefined,
      title: `${source.title} (Copy)`,
      slug: newSlug,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: undefined,
    };

    return this.create(cloned);
  },

  async publish(id: string): Promise<WebsiteProjectData | null> {
    return this.update(id, {
      status: "published",
      publishedAt: new Date(),
    });
  },

  async unpublish(id: string): Promise<WebsiteProjectData | null> {
    return this.update(id, {
      status: "unpublished",
    });
  },
};
