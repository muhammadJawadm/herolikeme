import { supabase } from "../lib/supabase";

export interface Ad {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  impressions: number;
  click_rates: number;
  ad_url: string;
  created_at: string;
}

export const fetchAds = async (): Promise<Ad[]> => {
  try {
    const { data, error } = await supabase
      .from("advertisements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching ads:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Exception in fetchAds:", err);
    return [];
  }
};

export const addAd = async (
  ad: Omit<Ad, "id" | "created_at">
): Promise<Ad | null> => {
  try {
    const { data, error } = await supabase
      .from("advertisements")
      .insert(ad)
      .select()
      .single();

    if (error) {
      console.error("Error adding ad:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Exception in addAd:", err);
    return null;
  }
};

export const updateAd = async (
  id: number,
  updates: Partial<Omit<Ad, "id" | "created_at">>
): Promise<Ad | null> => {
  try {
    const { data, error } = await supabase
      .from("advertisements")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating ad:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Exception in updateAd:", err);
    return null;
  }
};

export const deleteAd = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase.from("advertisements").delete().eq("id", id);

    if (error) {
      console.error("Error deleting ad:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Exception in deleteAd:", err);
    return false;
  }
};

export const uploadAdImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `ads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return null;
    }

    const { data } = supabase.storage.from("uploads").getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error in uploadAdImage:", error);
    return null;
  }
};

export const deleteAdImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract the file path from the URL
    const urlParts = imageUrl.split("/uploads/");
    if (urlParts.length < 2) return false;

    const filePath = urlParts[1];

    const { error } = await supabase.storage.from("uploads").remove([filePath]);

    if (error) {
      console.error("Error deleting image:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteAdImage:", error);
    return false;
  }
};
