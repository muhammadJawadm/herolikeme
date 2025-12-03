import { supabase } from "../lib/supabase";

export interface Feedbacks {
  id: number;                // bigint
  uid: string;               // uuid (references users.id)
  feedback_comment: string;  // text
  created_at: string;        // timestamp with time zone
}

export const fetchFeedback = async():Promise<Feedbacks[]>=>{
    let {data, error}= await supabase.from('feedback').select("*");

    if(error){
        console.log("Error while fetching the feedback data :",error);
    }
    return data as Feedbacks[]

}

export const deleteFeedback=async(id:number):Promise<boolean>=>{
    let {error} = await supabase.from('feedback').delete().eq("id",id);
    if(error){
        console.log("Error while deleting the feedback :",error);
    }
    return true;
}
