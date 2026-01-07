import { supabase } from "../lib/supabase";

export interface Community {
    id: number;               // bigint → number in TS
    catagory_id: number;      // foreign key
    title: string;
    description: string;
    created_at: string;       // timestamp with time zone → ISO string
}

export const fetchCommunities = async (): Promise<Community[]> => {
    let { data, error } = await supabase.from("community").select("*");
    if (error) {
        console.log("Error fetching communities:", error);
        return [];
    }
    return data as Community[];
};

export const deleteCommunity = async (id: number): Promise<boolean> => {
    let { error } = await supabase.from("community").delete().eq("id", id);
    if (error) {
        console.log("Error deleting community:", error);
        return false;
    }
    return true;
};

export const addCommunity = async (community: Omit<Community, 'id' | 'created_at'>): Promise<Community | null> => {
    let { data, error } = await supabase.from("community").insert({ community, is_heroz: true, }).select().single();
    if (error) {
        console.log("Error adding community:", error);
        return null;
    }
    return data;
};

export const updateCommunity = async (id: number, updatedFields: Partial<Omit<Community, 'id' | 'created_at'>>): Promise<Community | null> => {
    let { data, error } = await supabase.from("community").update(updatedFields).eq("id", id).select().single();
    if (error) {
        console.log("Error updating community:", error);
        return null;
    }
    return data;
};
