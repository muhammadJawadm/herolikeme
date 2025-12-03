import { supabase } from "../lib/supabase";

export interface User {
  id: string;                        // uuid
  created_at: string;                 // timestamp
  name?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  dob?: string;                       // date
  login_via?: string;                 // default 'email'
  is_premium: boolean;                // default false
  is_cancer?: boolean;
  is_other_chronic?: boolean;
  zip_code?: string;
  gender?: string;
  who_to_meet?: string;
  your_goal?: string;
  audio?: string;
  short_bio?: string;
  is_profile_complete: boolean;       
  fcm_token?: string;
  last_updated: string;               
  profile_images?: string[];          
  interests?: string[];               
  max_distance?: number;              
  is_whole_world?: boolean;
  age_range?: string;
  is_online?: boolean;
  last_seen?: string;                 
  fcm_token_updated_at?: string;      
  fcm_enabled: boolean;               
  is_paused?: boolean;
  show_last_active?: boolean;
  country?: string;
  language?: string;                  
  measurement_unit?: string;          
}
export const fetchUsers = async():Promise<User[]>=>{
let {data , error} = await supabase.from("users").select("*");
if(error){
    console.log("Error fetching users:", error);
    return [];
}
return data as User[];
}

export const fetchUserById = async(id:string):Promise<User | null>=>{
    let {data , error} = await supabase.from("users").select("*").eq("id",id).single();
    if(error){
        console.log("Error fetching user:", error);
        return null;
    }
    return data as User;
}