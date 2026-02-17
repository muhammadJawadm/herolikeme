import { supabase } from "../lib/supabase";
import type { User } from "./usersServices";

export interface UserLike {
    id: number;
    uid: string;
    liked_by: string;
    created_at: string;
}

export interface MutualMatch {
    userId: string;
    user: User | null;
}

/**
 * Fetch all likes for a specific user (both likes they received and gave)
 */
export const fetchUserLikes = async (userId: string): Promise<UserLike[]> => {
    const { data, error } = await supabase
        .from("user_likes")
        .select("*")
        .or(`uid.eq.${userId},liked_by.eq.${userId}`);

    if (error) {
        console.error("Error fetching user likes:", error);
        return [];
    }

    return data || [];
};

/**
 * Find mutual matches for a user (users who liked each other)
 * A match exists when:
 * - User A likes User B (uid=B, liked_by=A)
 * - User B likes User A (uid=A, liked_by=B)
 */
export const fetchMutualMatches = async (userId: string): Promise<MutualMatch[]> => {
    try {
        // Get all likes where this user liked someone
        const { data: userLikes, error: likesError } = await supabase
            .from("user_likes")
            .select("uid")
            .eq("liked_by", userId);

        if (likesError) {
            console.error("Error fetching user's likes:", likesError);
            return [];
        }

        if (!userLikes || userLikes.length === 0) {
            return [];
        }

        // Get list of user IDs that this user liked
        const likedUserIds = userLikes.map(like => like.uid);

        // Find mutual likes: users who liked this user back
        const { data: mutualLikes, error: mutualError } = await supabase
            .from("user_likes")
            .select("liked_by")
            .eq("uid", userId)
            .in("liked_by", likedUserIds);

        if (mutualError) {
            console.error("Error fetching mutual likes:", mutualError);
            return [];
        }

        if (!mutualLikes || mutualLikes.length === 0) {
            return [];
        }

        // Get user details for each matched user
        const matchedUserIds = mutualLikes.map(like => like.liked_by);

        const { data: users, error: usersError } = await supabase
            .from("users")
            .select("*, user_profiles(*)")
            .in("id", matchedUserIds);

        if (usersError) {
            console.error("Error fetching matched users:", usersError);
            return [];
        }

        // Map to MutualMatch format
        const matches: MutualMatch[] = matchedUserIds.map(matchedUserId => ({
            userId: matchedUserId,
            user: users?.find(u => u.id === matchedUserId) || null,
        }));

        return matches;
    } catch (error) {
        console.error("Error in fetchMutualMatches:", error);
        return [];
    }
};

/**
 * Get the count of mutual matches for a user
 */
export const fetchMutualMatchesCount = async (userId: string): Promise<number> => {
    const matches = await fetchMutualMatches(userId);
    return matches.length;
};

/**
 * 
 * Get the total count of all mutual matches in the system
 */
export const fetchAllMatchesCount = async (): Promise<number> => {
    try {
        const { data: allLikes, error } = await supabase
            .from("user_likes")
            .select("uid, liked_by");

        if (error) {
            console.error("Error fetching all likes:", error);
            return 0;
        }

        if (!allLikes || allLikes.length === 0) {
            return 0;
        }

        // Create a set of "sender-receiver" strings for fast lookup
        // Format: "senderId-receiverId"
        const likesSet = new Set<string>();
        allLikes.forEach(like => {
            likesSet.add(`${like.liked_by}-${like.uid}`);
        });

        let matchesCount = 0;
        const processedPairs = new Set<string>();

        allLikes.forEach(like => {
            const userA = like.liked_by;
            const userB = like.uid;

            // Ensure we only count each pair once by ordering IDs
            // We use a unique key for the pair, regardless of who liked whom first
            const pairKey = userA < userB ? `${userA}-${userB}` : `${userB}-${userA}`;

            if (processedPairs.has(pairKey)) {
                return;
            }

            // Check if the reciprocal like exists
            // If A liked B, did B like A?
            if (likesSet.has(`${userB}-${userA}`)) {
                matchesCount++;
                processedPairs.add(pairKey);
            }
        });

        return matchesCount;
    } catch (error) {
        console.error("Error in fetchAllMatchesCount:", error);
        return 0;
    }
};
