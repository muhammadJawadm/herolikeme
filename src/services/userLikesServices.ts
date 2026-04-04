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
 * Get the total count of all mutual matches in the system.
 * Fetches all rows in paginated batches to avoid the server-side row limit
 * that silently truncates a single large query.
 */
export const fetchAllMatchesCount = async (): Promise<number> => {
    try {
        const PAGE_SIZE = 1000;
        const allLikes: { uid: string; liked_by: string }[] = [];
        let from = 0;

        // Keep fetching pages until a page comes back with fewer rows than PAGE_SIZE
        while (true) {
            const { data, error } = await supabase
                .from("user_likes")
                .select("uid, liked_by")
                .range(from, from + PAGE_SIZE - 1);

            if (error) {
                console.error("Error fetching likes page:", error);
                return 0;
            }

            if (data && data.length > 0) {
                allLikes.push(...data);
            }

            // Last page reached
            if (!data || data.length < PAGE_SIZE) break;

            from += PAGE_SIZE;
        }

        if (allLikes.length === 0) return 0;

        // Build a fast-lookup set of "liked_by-uid" pairs
        const likesSet = new Set<string>(
            allLikes.map(like => `${like.liked_by}-${like.uid}`)
        );

        let matchesCount = 0;
        const processedPairs = new Set<string>();

        for (const like of allLikes) {
            const userA = like.liked_by;
            const userB = like.uid;

            // Canonical key so each pair is only counted once
            const pairKey = userA < userB ? `${userA}-${userB}` : `${userB}-${userA}`;
            if (processedPairs.has(pairKey)) continue;

            // Mutual match: B also liked A
            if (likesSet.has(`${userB}-${userA}`)) {
                matchesCount++;
                processedPairs.add(pairKey);
            }
        }

        return matchesCount;
    } catch (error) {
        console.error("Error in fetchAllMatchesCount:", error);
        return 0;
    }
};
