import  {supabase} from "../lib/supabase";
// src/types/quotes.ts
export interface Quote {
  id: number;                 // bigint
  category: string;           // text
  text: string;               // text
  author: string;             // text
  created_at: string;         // timestamp with time zone
}

export const fetchQuotes = async():Promise<Quote[]>=>{
    let {data , error} = await supabase.from("quotes").select("*");
    if(error){
        console.log("Error fetching quotes:", error);
        return [];
    }
    return data as Quote[];
}

export const deleteQuoteById = async(id:number):Promise<boolean>=>{
    let {error} = await supabase.from("quotes").delete().eq("id",id);
    if(error){
        console.log("Error deleting quote:", error);
        return false;
    }
    return true;
}

export const addQuote = async(quote:Omit<Quote,'id'|'created_at'>):Promise<Quote | null>=>{
    let {data , error} = await supabase.from("quotes").insert(quote).select().single();

    if(error){
        console.log("Error adding quote:", error);
        return null;
    }
    return data;
}   

export const updateQuote = async(id:number, updatedFields:Partial<Omit<Quote,'id'|'created_at'>>):Promise<Quote | null>=>{
    let {data , error} = await supabase.from("quotes").update(updatedFields).eq("id",id).select().single();
    if(error){
        console.log("Error updating quote:", error);
        return null;
    }
    return data;
}