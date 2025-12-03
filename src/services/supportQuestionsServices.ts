import { supabase } from "../lib/supabase";

export interface SupportQuestion {
  id: number;
  question: string;
  answer: string;
  type: 'help_center' | 'nurse_health';
  created_at: string;
  updated_at: string;
}

export const fetchSupportQuestions = async (): Promise<SupportQuestion[]> => {
  const { data, error } = await supabase
    .from("support_questions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching support questions:", error);
    return [];
  }

  return data || [];
};

export const fetchSupportQuestionsByType = async (type: 'help_center' | 'nurse_health'): Promise<SupportQuestion[]> => {
  const { data, error } = await supabase
    .from("support_questions")
    .select("*")
    .eq("type", type)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching support questions by type:", error);
    return [];
  }

  return data || [];
};

export const addSupportQuestion = async (
  question: Omit<SupportQuestion, "id" | "created_at" | "updated_at">
): Promise<SupportQuestion | null> => {
  const { data, error } = await supabase
    .from("support_questions")
    .insert(question)
    .select()
    .single();

  if (error) {
    console.error("Error adding support question:", error);
    return null;
  }

  return data;
};

export const updateSupportQuestion = async (
  id: number,
  updates: Partial<Omit<SupportQuestion, "id" | "created_at" | "updated_at">>
): Promise<SupportQuestion | null> => {
  const { data, error } = await supabase
    .from("support_questions")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating support question:", error);
    return null;
  }

  return data;
};

export const deleteSupportQuestion = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from("support_questions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting support question:", error);
    return false;
  }

  return true;
};
