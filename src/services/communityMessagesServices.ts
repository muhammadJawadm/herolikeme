import { supabase } from "../lib/supabase";

export interface CommunityMessage {
    id: number;
    sender: string;           // UUID
    community_id: number;
    message_type: string;     // 'text', 'image', 'voice', etc.
    message: string;
    created_at: string;
    // Joined fields from users table
    sender_name?: string;
    sender_email?: string;
}

export const fetchCommunityMessages = async (communityId: number): Promise<CommunityMessage[]> => {
    const { data, error } = await supabase
        .from("c_messages")
        .select("*")
        .eq("community_id", communityId)
        .order("created_at", { ascending: false });

    if (error) {
        console.log("Error fetching community messages:", error);
        return [];
    }

    console.log("Fetched messages for community", communityId, ":", data);

    // Fetch user details for each message
    const messagesWithUsers = await Promise.all(
        (data || []).map(async (item: any) => {
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("name, first_name, last_name, email")
                .eq("id", item.sender)
                .single();

            if (userError) {
                console.log("Error fetching user for sender:", item.sender, userError);
            }

            // Build full name from available fields
            const fullName = userData?.name || 
                           (userData?.first_name && userData?.last_name 
                               ? `${userData.first_name} ${userData.last_name}` 
                               : userData?.first_name || userData?.last_name || "Unknown User");

            return {
                id: item.id,
                sender: item.sender,
                community_id: item.community_id,
                message_type: item.message_type,
                message: item.message,
                created_at: item.created_at,
                sender_name: fullName,
                sender_email: userData?.email || ""
            };
        })
    );

    console.log("Messages with user details:", messagesWithUsers);

    return messagesWithUsers;
};

export const fetchAllMessages = async (): Promise<CommunityMessage[]> => {
    const { data, error } = await supabase
        .from("c_messages")
        .select(`
            *,
            users:sender (
                full_name,
                email
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.log("Error fetching all messages:", error);
        return [];
    }

    return (data || []).map((item: any) => ({
        id: item.id,
        sender: item.sender,
        community_id: item.community_id,
        message_type: item.message_type,
        message: item.message,
        created_at: item.created_at,
        sender_name: item.users?.full_name || "Unknown User",
        sender_email: item.users?.email || ""
    }));
};

export const deleteMessage = async (messageId: number): Promise<boolean> => {
    const { error } = await supabase
        .from("c_messages")
        .delete()
        .eq("id", messageId);

    if (error) {
        console.log("Error deleting message:", error);
        return false;
    }

    return true;
};

export const deleteMessagesByCommunity = async (communityId: number): Promise<boolean> => {
    const { error } = await supabase
        .from("c_messages")
        .delete()
        .eq("community_id", communityId);

    if (error) {
        console.log("Error deleting community messages:", error);
        return false;
    }

    return true;
};

export const getMessageCount = async (communityId: number): Promise<number> => {
    const { count, error } = await supabase
        .from("c_messages")
        .select("*", { count: "exact", head: true })
        .eq("community_id", communityId);

    if (error) {
        console.log("Error getting message count:", error);
        return 0;
    }

    return count || 0;
};
