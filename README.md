# ExpertoMemories (`https://expertomemories.shop`)

> **Bespoke Digital Gifting, Luxury Keepsakes & Interactive Wedding Invitation Platform**
> Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, MongoDB Atlas, Cloudflare R2, Razorpay & Netlify.

---

## 📚 Complete Project Learning & Documentation Suite

For a complete technical masterclass, codebase guide, architecture diagrams, and senior engineering interview preparation, explore our 20-chapter documentation in [`docs/project-learning/`](./docs/project-learning/00-START-HERE.md):

| Chapter | Guide | Subject |
| :---: | :--- | :--- |
| **00** | [Start Here](./docs/project-learning/00-START-HERE.md) | Reading guide, learning philosophy, and document map |
| **01** | [Project Overview](./docs/project-learning/01-PROJECT-OVERVIEW.md) | What ExpertoMemories does, problems solved, and user roles |
| **02** | [Technology Stack](./docs/project-learning/02-TECHNOLOGY-STACK.md) | In-depth breakdown of all 33 dependencies and frameworks |
| **03** | [Folder & File Guide](./docs/project-learning/03-FOLDER-AND-FILE-GUIDE.md) | Complete directory tree and responsibility of every file |
| **04** | [Application Architecture](./docs/project-learning/04-APPLICATION-ARCHITECTURE.md) | High-level system architecture and Mermaid diagrams |
| **05** | [Authentication & Security](./docs/project-learning/05-AUTHENTICATION-AND-SECURITY.md) | Dual-token JWTs, HTTPOnly cookies, bcrypt, and proxy guards |
| **06** | [Customer Journey](./docs/project-learning/06-CUSTOMER-JOURNEY.md) | 20-stage customer flow from discovery to published gift |
| **07** | [Gift Editor & Publishing](./docs/project-learning/07-GIFT-EDITOR-AND-PUBLISHING.md) | Visual studio editor, live preview, and publish lifecycle |
| **08** | [Database & Models](./docs/project-learning/08-DATABASE-AND-MODELS.md) | MongoDB Atlas schemas, 10 Mongoose models, and relationships |
| **09** | [API Reference](./docs/project-learning/09-API-REFERENCE.md) | Complete REST API dictionary covering 45 route handlers |
| **10** | [Pricing & Payments](./docs/project-learning/10-PRICING-AND-PAYMENTS.md) | Dynamic database pricing engine, Razorpay, and manual UPI |
| **11** | [Admin Studio](./docs/project-learning/11-ADMIN-STUDIO.md) | Studio portal (`/studio`), order management, and audit logs |
| **12** | [Specialized Experiences](./docs/project-learning/12-OTHER-FEATURES.md) | Wedding invitations, RSVP system, Love, Birthday, Anniversary |
| **13** | [Cloud Storage & Media](./docs/project-learning/13-FILE-STORAGE.md) | Cloudflare R2 S3 presigned direct upload pipeline |
| **14** | [Environment & Deployment](./docs/project-learning/14-ENVIRONMENT-AND-DEPLOYMENT.md) | Environment configuration variables and Netlify edge builds |
| **15** | [Debugging & Testing](./docs/project-learning/15-DEBUGGING-AND-TESTING.md) | Diagnostics, browser DevTools, and automated Playwright tests |
| **16** | [Programming Concepts](./docs/project-learning/16-PROGRAMMING-CONCEPTS.md) | 32 essential software engineering concepts explained |
| **17** | [Learning Roadmap](./docs/project-learning/17-LEARNING-ROADMAP.md) | 7-phase step-by-step master study curriculum |
| **18** | [Interview Preparation](./docs/project-learning/18-INTERVIEW-PREPARATION.md) | Elevator pitches and 45+ rigorous technical interview Q&As |
| **19** | [Technical Terms Glossary](./docs/project-learning/19-GLOSSARY.md) | Full-stack terminology explained simply |

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start local Turbopack development server on port 3000
npm run dev

# 3. Verify TypeScript type safety
npx tsc --noEmit

# 4. Run automated multi-viewport responsive test suite
node scripts/verify-all-viewports.mjs

# 5. Production build
npm run build
```

---

## 🔒 Architectural Highlights

1. **Server-Authoritative Pricing:** The browser never dictates prices; they are computed dynamically from MongoDB records on the server (`src/lib/pricing.ts`).
2. **Dual-Token Security:** Platform Administrators (`em_admin_token`) and Customers (`em_customer_token`) use completely segregated JWT sessions and middleware redirect gates (`src/proxy.ts`).
3. **Direct S3 Uploads:** Media files stream directly from the client browser to Cloudflare R2 via presigned URLs (`src/lib/r2.ts`), eliminating web server memory spikes and bandwidth egress costs.
4. **Mobile-First Responsiveness:** Zero horizontal scrollbar overflow across all mobile viewports ($320\text{px}$ to $430\text{px}$), tablets, laptops, and ultra-wide desktop monitors ($1920\text{px}$).
