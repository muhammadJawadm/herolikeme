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
  short_bio ?: string;         
  updated_at?: string;         
  who_to_meet?: string[];  
  your_goal?: string;
  zip_code?: string;             // extracted URLs
}

export const fetchUsers = async():Promise<User[]>=>{
let {data , error} = await supabase.from("users").select("*, user_profiles(*)");
if(error){
    console.log("Error fetching users:", error);
    return [];
}
return data as User[];
}

export const fetchUserById = async(id:string):Promise<User | null>=>{
    let {data , error} = await supabase.from("users").select("* , user_profiles(*)").eq("id",id).single();
    if(error){
        console.log("Error fetching user:", error);
        return null;
    }
    return data as User;
}