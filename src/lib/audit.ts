import { connectToDatabase } from "@/lib/mongodb";
import { AdminAuditLog } from "@/models/AdminAuditLog";

export interface LogAdminActionParams {
  actor: string;
  action: string;
  targetType: "order" | "customer" | "website" | "domain" | "pricing" | "catalogue" | "system";
  targetId?: string;
  targetIdentifier?: string;
  details?: Record<string, any>;
  notes?: string;
}

/**
 * Appends an entry to the immutable AdminAuditLog collection.
 * Non-blocking: catches and logs errors so it does not fail the primary operation.
 */
export async function logAdminAction(params: LogAdminActionParams): Promise<void> {
  try {
    await connectToDatabase();
    await AdminAuditLog.create({
      actor: params.actor.toLowerCase().trim(),
      action: params.action.toUpperCase().trim(),
      targetType: params.targetType,
      targetId: params.targetId,
      targetIdentifier: params.targetIdentifier,
      details: params.details || {},
      notes: params.notes?.trim(),
    });
  } catch (error) {
    console.error("Failed to write to AdminAuditLog:", error);
  }
}
