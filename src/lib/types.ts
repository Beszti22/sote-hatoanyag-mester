export type Drug = {
  id: string;
  category: string;
  name: string;
  mechanism: string;
  side_effects: string;
  indication: string | null;
  is_free: boolean;
  sort_order: number;
};

export type DrugWithProgress = Drug & {
  learned: boolean;
};

export type SubscriptionStatus = "none" | "active" | "past_due" | "canceled";
