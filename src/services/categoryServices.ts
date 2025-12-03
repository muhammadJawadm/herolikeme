import { supabase } from "../lib/supabase";

export interface CategoryGroup {
  id: number;
  title: string;
  created_at: string;
}

export const fetchCategories = async (): Promise<CategoryGroup[]> => {
  const { data, error } = await supabase
    .from("group_catagory")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
};

export const fetchCategoryById = async (id: number): Promise<CategoryGroup | null> => {
  const { data, error } = await supabase
    .from("group_catagory")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    return null;
  }

  return data;
};

export const addCategory = async (category: Omit<CategoryGroup, "id" | "created_at">): Promise<CategoryGroup | null> => {
  const { data, error } = await supabase
    .from("group_catagory")
    .insert(category)
    .select()
    .single();  
    if(error){
        console.log("Error adding category:", error);
        return null;
    }
    return data;
}

export const updateCategory = async (id: number, updatedFields: Partial<Omit<CategoryGroup, "id" | "created_at">>): Promise<CategoryGroup | null> => {
  const { data, error } = await supabase
    .from("group_catagory")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("Error updating category:", error);
    return null;
  }
  return data;
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from("group_catagory") 
    .delete()
    .eq("id", id);
  if (error) {
    console.error("Error deleting category:", error);
    return false;
  }
  return true;
};