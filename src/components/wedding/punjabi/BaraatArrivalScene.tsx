import React from "react";
import { Sparkles, MapPin, Clock, Calendar, Users } from "lucide-react";
import { MarigoldToranGarland, PhulkariDiamondBorder } from "./PhulkariPatterns";

interface BaraatProps {
  groomName?: string;
  brideName?: string;
  weddingDateText?: string;
  config?: {
    enabled?: boolean;
    title?: string;
    description?: string;
    time?: string;
    venueName?: string;
    assemblyPoint?: string;
    dressCode?: string;
  };
}

export const BaraatArrivalScene: React.FC<BaraatProps> = ({
  groomName = "Harpreet",
  brideName = "Simran",
  weddingDateText,
  config,
}) => {
  // If explicitly disabled by creator, skip rendering
  if (config?.enabled === false) {
    return null;
  }

  return (
    <section
      id="baraat-scene"
      aria-label="The Grand Baraat Arrival"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#26050C] via-[#3A0813] to-[#26050C] text-[#FFFDF9] overflow-hidden border-t border-[#E5A910]/30"
    >
      {/* Decorative Marigold Swag across top of Baraat archway */}
      <div className="absolute top-0 inset-x-0">
        <MarigoldToranGarland />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5A910]/15 border border-[#E5A910]/30 text-[#FBBF24] text-[10px] font-mono uppercase tracking-[0.25em]">
            <Sparkles size={12} className="text-[#FBBF24]" />
            <span>SHAHI AGMAN &bull; THE GRAND PROCESSION</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFDF9]">
            {config?.title || `The Shahi Baraat of ${groomName}`}
          </h2>

          <p className="font-serif italic text-sm sm:text-base text-amber-200/90 max-w-xl mx-auto leading-relaxed">
            {config?.description ||
              "With live dholis beating festive rhythms, brass band fanfare, and dancing family members, the groom arrives in royal Punjabi splendour to be welcomed by the bride’s loving family."}
          </p>
        </div>

        {/* Cinematic Illustration of Grand Haveli Gateway & Festive Procession */}
        <div className="relative w-full max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-[#4A0E17] to-[#1F040A] border-2 border-[#E5A910]/50 p-6 sm:p-10 shadow-2xl overflow-hidden text-center">
          {/* Subtle Royal Arch Backdrop SVG */}
          <div className="absolute inset-0 opacity-15 flex items-center justify-center pointer-events-none">
            <svg width="600" height="400" viewBox="0 0 600 400" fill="none">
              <path
                d="M50 400 V180 C50 80 180 30 300 30 C420 30 550 80 550 180 V400"
                stroke="#FDE68A"
                strokeWidth="4"
              />
              <path
                d="M80 400 V190 C80 100 190 60 300 60 C410 60 520 100 520 190 V400"
                stroke="#FDE68A"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
            </svg>
          </div>

          {/* Festive Dhol & Ghodi Procession Silhouette Graphic */}
          <div className="relative my-4 flex items-center justify-center">
            <svg
              width="320"
              height="140"
              viewBox="0 0 320 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full max-w-xs sm:max-w-md filter drop-shadow-[0_8px_20px_rgba(245,158,11,0.3)]"
            >
              {/* Procession ground line */}
              <line x1="10" y1="130" x2="310" y2="130" stroke="#FDE68A" strokeWidth="2" strokeDasharray="4 2" />

              {/* Dholi 1 (Left with Dhol) */}
              <circle cx="50" cy="55" r="12" fill="#FBBF24" />
              {/* Turban (Pagri / Turla) */}
              <path d="M42 45 Q50 32 60 40 Q54 48 42 45 Z" fill="#C2185B" />
              <path d="M50 35 L52 24 L56 34 Z" fill="#E5A910" />
              {/* Body */}
              <path d="M40 70 L60 70 L58 115 L42 115 Z" fill="#FBBF24" opacity="0.85" />
              {/* Dhol hung on shoulder */}
              <ellipse cx="62" cy="85" rx="16" ry="12" transform="rotate(-15 62 85)" fill="#78350F" stroke="#FDE68A" strokeWidth="1.5" />
              <line x1="48" y1="78" x2="76" y2="92" stroke="#E5A910" strokeWidth="1.5" />

              {/* Groom on Decorated Steed (Center) */}
              {/* Steed body */}
              <ellipse cx="160" cy="90" rx="36" ry="24" fill="#E2E8F0" opacity="0.9" />
              <path d="M190 90 Q205 60 215 50 Q225 65 210 95 Z" fill="#E2E8F0" opacity="0.9" />
              {/* Steed Head & Ear */}
              <ellipse cx="218" cy="52" rx="14" ry="9" transform="rotate(-25 218 52)" fill="#FFFFFF" />
              <path d="M214 42 L218 32 L224 42 Z" fill="#FFFFFF" />
              {/* Red & Gold Bridle */}
              <path d="M210 55 L225 50" stroke="#C2185B" strokeWidth="2" />
              {/* Traditional Red & Gold Embroidered Saddle (Zin) */}
              <path d="M140 78 L180 78 L175 98 L145 98 Z" fill="#C2185B" stroke="#FDE68A" strokeWidth="1.5" />
              {/* Steed legs */}
              <line x1="135" y1="105" x2="132" y2="130" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />
              <line x1="150" y1="108" x2="148" y2="130" stroke="#E2E8F0" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="175" y1="108" x2="178" y2="130" stroke="#E2E8F0" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="190" y1="102" x2="195" y2="130" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />

              {/* Groom Seated */}
              <circle cx="160" cy="50" r="10" fill="#FDE68A" />
              {/* Royal Turban (Shahi Sehra / Kalgi) */}
              <path d="M152 42 Q160 30 170 38 Q164 48 152 42 Z" fill="#C2185B" />
              {/* Kalgi Plume */}
              <path d="M162 32 Q166 18 170 24" stroke="#FBBF24" strokeWidth="2" fill="none" />
              {/* Golden Sherwani */}
              <path d="M150 60 L170 60 L168 80 L152 80 Z" fill="#E5A910" />

              {/* Dholi 2 (Right with Bhangra celebratory pose) */}
              <circle cx="270" cy="55" r="12" fill="#FBBF24" />
              {/* Turban */}
              <path d="M262 45 Q270 32 280 40 Q274 48 262 45 Z" fill="#044E36" />
              {/* Arms raised in celebration */}
              <path d="M260 70 L250 50 L242 55" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M280 70 L290 50 L298 55" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Body */}
              <path d="M260 70 L280 70 L278 115 L262 115 Z" fill="#044E36" opacity="0.85" />
            </svg>
          </div>

          {/* Procession Timing & Key Ceremonies */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-6 mt-6 border-t border-[#E5A910]/30 text-xs">
            <div className="p-4 rounded-2xl bg-[#26050C]/80 border border-[#E5A910]/30">
              <div className="flex items-center gap-1.5 text-[#FBBF24] font-bold mb-1.5 font-serif">
                <Clock size={14} />
                <span>Baraat Assembly &amp; Dhol</span>
              </div>
              <p className="text-amber-100/90 font-sans leading-relaxed">
                {config?.time || "10:30 AM onwards"} &bull; Gathering of family, sehra bandi, and beginning of live dhol beats.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#26050C]/80 border border-[#E5A910]/30">
              <div className="flex items-center gap-1.5 text-[#FBBF24] font-bold mb-1.5 font-serif">
                <Users size={14} />
                <span>Joyous Milni Ceremony</span>
              </div>
              <p className="text-amber-100/90 font-sans leading-relaxed">
                Traditional welcoming of family counterparts with rose garlands, warm hugs, and festive congratulations.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#26050C]/80 border border-[#E5A910]/30">
              <div className="flex items-center gap-1.5 text-[#FBBF24] font-bold mb-1.5 font-serif">
                <MapPin size={14} />
                <span>Grand Entrance Gateway</span>
              </div>
              <p className="text-amber-100/90 font-sans leading-relaxed">
                {config?.venueName || "The Heritage Haveli Resort Main Gate, GT Road, Amritsar"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Phulkari Divider at bottom of section */}
      <div className="absolute bottom-0 inset-x-0">
        <PhulkariDiamondBorder />
      </div>
    </section>
  );
};
