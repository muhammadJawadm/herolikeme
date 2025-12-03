import { supabase } from "../lib/supabase";

export interface SelfieVerification {
  id: number;
  uid: string;
  selfie_url: string;
  status: 'pending' | 'verified' | 'rejected';
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

export const fetchSelfieVerificationByUserId = async (userId: string): Promise<SelfieVerification | null> => {
  const { data, error } = await supabase
    .from("selfie_verifications")
    .select("*")
    .eq("uid", userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned - user hasn't submitted selfie verification
      return null;
    }
    console.error("Error fetching selfie verification:", error);
    return null;
  }

  return data;
};

export const updateSelfieVerificationStatus = async (
  id: number,
  status: 'pending' | 'verified' | 'rejected',
  adminNote?: string
): Promise<SelfieVerification | null> => {
  const updateData: any = {
    status: status,
    updated_at: new Date().toISOString()
  };

  if (adminNote !== undefined) {
    updateData.admin_note = adminNote;
  }

  const { data, error } = await supabase
    .from("selfie_verifications")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating selfie verification status:", error);
    return null;
  }

  return data;
};

export const fetchPendingSelfieVerifications = async (): Promise<SelfieVerification[]> => {
  const { data, error } = await supabase
    .from("selfie_verifications")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending selfie verifications:", error);
    return [];
  }

  return data || [];
};

export const fetchAllSelfieVerifications = async (): Promise<SelfieVerification[]> => {
  const { data, error } = await supabase
    .from("selfie_verifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching selfie verifications:", error);
    return [];
  }

  return data || [];
};
