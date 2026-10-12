import { createClient } from "@/lib/supabase/server";
import type { SubscriptionStatus } from "@/lib/types";

/**
 * Looks up whether the current user has an active subscription.
 * Returns "none" for signed-out visitors or users with no subscriptions row.
 */
export async function getSubscriptionStatus(
  userId: string | null
): Promise<SubscriptionStatus> {
  if (!userId) return "none";

  const supabase = await createClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return "none";
  if (data.status !== "active") return data.status as SubscriptionStatus;
  if (data.current_period_end && new Date(data.current_period_end) < new Date()) {
    return "past_due";
  }
  return "active";
}
