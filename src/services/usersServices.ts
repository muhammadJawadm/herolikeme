import { supabase } from "../lib/supabase";

export interface User {
  id: string;                        // uuid
  created_at: string;               // timestamp
  email: string;

  name?: string;
  first_name?: string;
  last_name?: string;
  cnic?: string | null;

  login_via?: string;               // e.g. 'google'
  is_premium: boolean;
  is_profile_complete: boolean;

  is_online?: boolean;
  last_seen?: string;
  last_updated: string;

  fcm_enabled: boolean;
  fcm_token?: string;
  fcm_token_updated_at?: string;

  is_paused?: boolean;
  show_last_active?: boolean;

  user_profiles?: UserProfile;      // 👈 nested object
}
export interface UserProfile {
  id: string;                       // same as user id (FK)
  created_at: string;

  address?: string;
  country?: string;
  language?: string;

  dob?: string;                     // YYYY-MM-DD
  gender?: string;                  // 'women' | 'men' | etc.
  age_range?: string;

  is_cancer?: boolean;
  is_other_chronic?: boolean;
  is_whole_world?: boolean;

  max_distance?: number;
  measurement_unit?: 'imperial' | 'metric';

  audio?: string;
  interests?: string[] | null;

  profile_images?: string[];
  short_bio?: string;
  updated_at?: string;
  who_to_meet?: string[];
  your_goal?: string;
  zip_code?: string;             // extracted URLs
}

/**
 * Fetches all users from the database with pagination
 * Supabase has a max limit of 1000 rows per request, so we fetch in batches
 */
export const fetchUsers = async (): Promise<User[]> => {
  const PAGE_SIZE = 1000;
  const allUsers: User[] = [];
  let start = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error, count } = await supabase
      .from("users")
      .select("*, user_profiles(*)", { count: 'exact' })
      .range(start, start + PAGE_SIZE - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return allUsers;
    }

    if (data && data.length > 0) {
      allUsers.push(...data);

      if (data.length < PAGE_SIZE || allUsers.length >= (count || 0)) {
        hasMore = false;
      } else {
        start += PAGE_SIZE;
      }
    } else {
      hasMore = false;
    }
  }

  return allUsers;
}

/**
 * Fetches a single user by their ID with their profile data
 */
export const fetchUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*, user_profiles(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data as User;
}