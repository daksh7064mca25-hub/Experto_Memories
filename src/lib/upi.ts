export interface ManualUpiConfig {
  upiId: string;
  payeeName: string;
  qrImageUrl: string;
}

export function getManualUpiConfig(settingsUpi?: {
  upiId?: string;
  displayName?: string;
  qrCodeUrl?: string;
}): ManualUpiConfig {
  // Determine UPI ID: env var -> settings -> fallback
  const upiId =
    process.env.MANUAL_UPI_ID ||
    process.env.UPI_ID ||
    settingsUpi?.upiId ||
    "";

  // Determine Payee Name
  const payeeName =
    process.env.MANUAL_UPI_NAME ||
    process.env.UPI_NAME ||
    settingsUpi?.displayName ||
    "ExpertoMemories";

  // Determine QR Image URL
  let qrImageUrl =
    process.env.MANUAL_UPI_QR_URL ||
    process.env.UPI_QR_URL ||
    settingsUpi?.qrCodeUrl ||
    "/images/upi-qr.jpeg";

  // Clean and normalize legacy filenames or localhost domains
  if (qrImageUrl.includes("upi-qr.png")) {
    qrImageUrl = qrImageUrl.replace("upi-qr.png", "upi-qr.jpeg");
  }
  if (qrImageUrl.startsWith("http://localhost:3000/")) {
    qrImageUrl = qrImageUrl.replace("http://localhost:3000/", "/");
  }
  if (!qrImageUrl || qrImageUrl.trim() === "") {
    qrImageUrl = "/images/upi-qr.jpeg";
  }

  return {
    upiId: upiId.trim(),
    payeeName: payeeName.trim(),
    qrImageUrl: qrImageUrl.trim(),
  };
}

/**
 * Generates an official UPI deep-link intent string for mobile wallets (GPay, PhonePe, Paytm, BHIM)
 */
export function generateUpiIntentUri({
  upiId,
  payeeName,
  amountInINR,
  orderNumber,
}: {
  upiId: string;
  payeeName: string;
  amountInINR: number;
  orderNumber: string;
}): string {
  const cleanUpiId = upiId.trim();
  const cleanName = encodeURIComponent(payeeName.trim());
  const cleanAmount = amountInINR.toFixed(2);
  const note = encodeURIComponent(`ExpertoMemories Gift ${orderNumber}`);

  return `upi://pay?pa=${cleanUpiId}&pn=${cleanName}&am=${cleanAmount}&cu=INR&tn=${note}`;
}
