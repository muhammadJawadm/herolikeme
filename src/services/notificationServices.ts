import { supabase } from "../lib/supabase";

// src/types/notifications.ts
export interface Notification {
  id: string;                       // uuid
  created_at: string;               // timestamp with time zone
  updated_at: string;               // timestamp with time zone
  user_id: string;                  // uuid (FK → users.id)
  actor_id?: string | null;         // uuid | null
  type: string;                     // text
  payload: Record<string, any>;     // jsonb
  status: string;                   // text (default 'unseen')
}

export const fetchNotifications = async(): Promise<Notification[]> => {
    let { data, error } = await supabase.from("notifications").select("*").order('created_at', { ascending: false });
    if (error) {
        console.log("Error fetching notifications:", error);
        return [];
    }
    return data as Notification[];
};

export const deleteNotification = async(id: string): Promise<boolean> => {
    let { error } = await supabase.from("notifications").delete().eq("id", id);
    if (error) {
        console.log("Error deleting notification:", error);
        return false;
    }
    return true;
};

export const addNotification = async(notification: Omit<Notification, 'id' | 'created_at' | 'updated_at'>): Promise<Notification | null> => {
    let { data, error } = await supabase.from("notifications").insert(notification).select().single();
    if (error) {
        console.log("Error adding notification:", error);
        return null;
    }
    return data;
};

export const updateNotification = async(id: string, updatedFields: Partial<Omit<Notification, 'id' | 'created_at'>>): Promise<Notification | null> => {
    const updateData = {
        ...updatedFields,
        updated_at: new Date().toISOString()
    };
    let { data, error } = await supabase.from("notifications").update(updateData).eq("id", id).select().single();
    if (error) {
        console.log("Error updating notification:", error);
        return null;
    }
    return data;
};