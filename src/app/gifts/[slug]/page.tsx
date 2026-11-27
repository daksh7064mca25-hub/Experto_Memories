import { PublicHeader } from "@/components/navigation/PublicHeader";
import { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getProductBySlug,
  CATALOG_PRODUCTS,
} from "@/config/products";
import { getEffectivePricing } from "@/lib/pricing";
import {
  Heart,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Gift,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Gift Not Found | ExpertoMemories" };
  }

  return {
    title: `${product.title} | ExpertoMemories Digital Gifts`,
    description: product.description,
    openGraph: {
      title: `${product.title} — Personalized Digital Gift`,
      description: product.subtitle,
      type: "website",
    },
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  let displayPrice = product.price;
  let originalPrice = product.originalPrice;

  try {
    const { productPrice, effectivePricing } = await getEffectivePricing(slug);
    const pricingInfo = effectivePricing.products.find(
      (p) =>
        p.slug.toLowerCase() === slug.toLowerCase() ||
        p.occasionType.toLowerCase() === product.occasionType.toLowerCase()
    );
    displayPrice = pricingInfo?.price ?? productPrice ?? product.price;
    originalPrice = pricingInfo?.originalPrice ?? product.originalPrice;
  } catch (err) {
    console.error("Error fetching effective pricing for product slug:", slug, err);
  }

  return (
    <div className="min-h-screen bg-[#faf7f5] text-stone-900 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* UNIVERSAL NAVBAR */}
      <PublicHeader />

      {/* 3. BREADCRUMBS */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-6 pb-2 w-full">
        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-serif">
          <Link href="/" className="hover:text-rose-600">Home</Link>
          <ChevronRight size={12} className="text-stone-400" />
          <Link href="/#products" className="hover:text-rose-600">Digital Gifts</Link>
          <ChevronRight size={12} className="text-stone-400" />
          <span className="text-stone-900 font-semibold">{product.title}</span>
        </div>
      </div>

      {/* 4. PRODUCT SHOWCASE HERO */}
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-12 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Visual Card & Live Demo Action */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-3xl bg-white border border-rose-100 p-8 shadow-xl shadow-rose-950/5 relative overflow-hidden text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-100 to-pink-100 flex items-center justify-center text-rose-500 mb-6 shadow-inner">
                <Gift size={36} />
              </div>

              <span className="text-xs font-mono font-bold tracking-widest text-rose-500 uppercase mb-2">
                {product.occasionType.toUpperCase()} EXPERIENCE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                {product.title}
              </h2>
              <p className="text-xs text-stone-500 max-w-xs mb-8">
                {product.subtitle}
              </p>

              {/* Demo Button */}
              <Link
                href={product.demoUrl}
                className="w-full py-3.5 px-6 rounded-2xl bg-white border-2 border-rose-200 hover:border-rose-400 text-rose-800 font-serif font-bold text-sm shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2 mb-3"
              >
                <Eye size={16} className="text-rose-500" />
                <span>Experience Full Live Demo</span>
              </Link>

              <p className="text-[11px] text-stone-400 font-serif">
                Opens real sample website with sounds and animations.
              </p>
            </div>

            {/* Mobile-Friendly Guarantees */}
            <div className="bg-white/80 rounded-2xl p-5 border border-stone-200/80 space-y-3 text-xs text-stone-700 font-sans">
              <div className="flex items-center gap-2.5">
                <Smartphone size={16} className="text-rose-500 shrink-0" />
                <span><strong>No App Required:</strong> Opens instantly in mobile Safari or Chrome.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                <span><strong>Password Protection:</strong> Keep your photos and letters private.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span><strong>12 Months Hosting Included:</strong> Easily renewable when you choose.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details, Features & Customization CTA */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-serif font-bold bg-rose-100 text-rose-800">
                {product.badge || "Signature Gift"}
              </span>
              <span className="text-xs text-stone-400 font-mono">100% Mobile Optimized</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight mb-4">
              {product.title}
            </h1>

            <p className="text-sm sm:text-base text-stone-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Pricing Card */}
            <div className="rounded-2xl bg-white border border-stone-200 p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-bold text-stone-900">{`₹${displayPrice}`}</span>
                  {originalPrice && originalPrice > displayPrice && (
                    <span className="text-sm text-stone-400 line-through font-mono">{`₹${originalPrice}`}</span>
                  )}
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    Free Customization &amp; Preview Included
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Pay only when you are 100% happy with your preview and ready to publish.
                </p>
              </div>

              <Link
                href={`/dashboard/create?occasion=${product.occasionType}`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full font-serif font-bold text-sm bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-200 transition-all hover:scale-105 flex items-center justify-center gap-2 shrink-0"
              >
                <span>Customize Your Gift</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Features Breakdown */}
            <div className="mb-8">
              <h3 className="font-serif font-bold text-lg text-stone-900 mb-4">
                What&rsquo;s Inside This Digital Experience:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-stone-200/70 text-xs text-stone-800"
                  >
                    <CheckCircle2 size={15} className="text-rose-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Theme Options */}
            <div className="mb-8">
              <h3 className="font-serif font-bold text-lg text-stone-900 mb-3">
                Included Color Palettes & Themes:
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                Switch themes instantly with one click inside the editor anytime.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {product.themes.map((theme) => (
                  <div
                    key={theme.id}
                    className="p-3 rounded-2xl bg-white border border-stone-200/80 flex flex-col items-center text-center"
                  >
                    <div
                      className="w-7 h-7 rounded-full mb-2 shadow-sm"
                      style={{ backgroundColor: theme.previewColor }}
                    />
                    <span className="font-serif font-bold text-xs text-stone-900 mb-0.5">
                      {theme.name}
                    </span>
                    <span className="text-[10px] text-stone-400 line-clamp-1 leading-tight">
                      {theme.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary CTAs */}
            <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href={`/dashboard/create?occasion=${product.occasionType}`}
                className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-serif font-bold text-center text-sm shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2"
              >
                <span>Start Customizing For Free</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href={product.demoUrl}
                className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-serif font-semibold text-center text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                <span>View Live Demo First</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 5. FOOTER (NO ADMIN BUTTONS) */}
      <footer className="w-full bg-stone-900 text-stone-400 py-10 px-5 sm:px-8 border-t border-stone-800 text-xs mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <Link href="/" className="inline-flex items-center gap-2.5 group" aria-label="ExpertoMemories Home">
            <div className="relative h-7 w-auto shrink-0 flex items-center">
              <Image
                src="/branding/expertomemories-monogram.png"
                alt="ExpertoMemories EM Monogram"
                width={505}
                height={321}
                className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div>
              <span className="font-serif font-bold text-base text-white block">
                ExpertoMemories
              </span>
              <span className="text-[11px] text-stone-500">
                Personalized interactive digital gifts delivered via a private link.
              </span>
            </div>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-6 text-stone-400 font-serif">
            <Link href="/demo/apology" className="hover:text-white transition-colors">Apology Demo</Link>
            <Link href="/demo/anniversary" className="hover:text-white transition-colors">Anniversary Demo</Link>
            <Link href="/demo/birthday" className="hover:text-white transition-colors">Birthday Demo</Link>
            <Link href="/demo/love" className="hover:text-white transition-colors">Love Demo</Link>
          </div>

          <div className="text-[11px] text-stone-500">
            &copy; {new Date().getFullYear()} ExpertoMemories. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
