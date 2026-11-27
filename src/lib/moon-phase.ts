/**
 * Astronomical Lunar Phase Calculator
 * Computes the exact lunar age, phase name, illumination fraction, and days to next full moon
 * based on the synodic lunar cycle (29.53058867 days).
 */

export interface MoonPhaseData {
  phaseName: string;
  phaseCode:
    | "new_moon"
    | "waxing_crescent"
    | "first_quarter"
    | "waxing_gibbous"
    | "full_moon"
    | "waning_gibbous"
    | "last_quarter"
    | "waning_crescent";
  illuminationPercent: number; // 0 to 100
  moonAgeDays: number; // 0 to 29.53
  phaseDescription: string;
  isWaxing: boolean;
  daysToNextFullMoon: number;
}

// Known New Moon reference epoch: January 6, 2000 at 18:14 UTC
const SYNODIC_MONTH = 29.53058867;
const REF_NEW_MOON_EPOCH = new Date("2000-01-06T18:14:00Z").getTime();

export function calculateMoonPhase(dateInput?: Date | string | null): MoonPhaseData {
  let targetDate = new Date();

  if (dateInput) {
    const parsed = new Date(dateInput);
    if (!isNaN(parsed.getTime())) {
      targetDate = parsed;
    }
  }

  // Days elapsed since reference new moon
  const diffMs = targetDate.getTime() - REF_NEW_MOON_EPOCH;
  const diffDays = diffMs / 86400000;

  // Normalized phase fraction [0, 1)
  let phaseFraction = (diffDays % SYNODIC_MONTH) / SYNODIC_MONTH;
  if (phaseFraction < 0) {
    phaseFraction += 1;
  }

  const moonAgeDays = Math.round(phaseFraction * SYNODIC_MONTH * 10) / 10;

  // Illumination percentage: 0% at New Moon (phase 0 or 1), 100% at Full Moon (phase 0.5)
  const illuminationFraction = (1 - Math.cos(2 * Math.PI * phaseFraction)) / 2;
  const illuminationPercent = Math.round(illuminationFraction * 100);

  // Determine 8 standard astronomical phases
  let phaseName = "New Moon";
  let phaseCode: MoonPhaseData["phaseCode"] = "new_moon";
  let phaseDescription = "A dark sky, waiting for the first light of our story to shine.";
  const isWaxing = phaseFraction < 0.5;

  if (phaseFraction >= 0.03 && phaseFraction < 0.22) {
    phaseName = "Waxing Crescent";
    phaseCode = "waxing_crescent";
    phaseDescription = "A delicate glowing sliver of silver light, just as our love was beginning to unfold.";
  } else if (phaseFraction >= 0.22 && phaseFraction < 0.28) {
    phaseName = "First Quarter";
    phaseCode = "first_quarter";
    phaseDescription = "Half-illuminated and growing stronger each night, steady and poised.";
  } else if (phaseFraction >= 0.28 && phaseFraction < 0.47) {
    phaseName = "Waxing Gibbous";
    phaseCode = "waxing_gibbous";
    phaseDescription = "Nearly radiant, shining brightly as our bond deepened with every conversation.";
  } else if (phaseFraction >= 0.47 && phaseFraction < 0.53) {
    phaseName = "Full Moon";
    phaseCode = "full_moon";
    phaseDescription = "Complete, luminous, and radiant — celebrating our love under a sky bathed in moonlight.";
  } else if (phaseFraction >= 0.53 && phaseFraction < 0.72) {
    phaseName = "Waning Gibbous";
    phaseCode = "waning_gibbous";
    phaseDescription = "Luminescent and warm, casting an intimate glow over our shared memories.";
  } else if (phaseFraction >= 0.72 && phaseFraction < 0.78) {
    phaseName = "Last Quarter";
    phaseCode = "last_quarter";
    phaseDescription = "A calm half-moon in the quiet night sky, steady and enduring through time.";
  } else if (phaseFraction >= 0.78 && phaseFraction < 0.97) {
    phaseName = "Waning Crescent";
    phaseCode = "waning_crescent";
    phaseDescription = "A whisper of silver light in the morning dawn, keeping our sweetest secrets safe.";
  }

  // Days to next full moon (full moon is at phase 0.5)
  let daysToFull = (0.5 - phaseFraction) * SYNODIC_MONTH;
  if (daysToFull < 0) {
    daysToFull += SYNODIC_MONTH;
  }
  const daysToNextFullMoon = Math.round(daysToFull);

  return {
    phaseName,
    phaseCode,
    illuminationPercent,
    moonAgeDays,
    phaseDescription,
    isWaxing,
    daysToNextFullMoon,
  };
}
