import { supabase } from "../lib/supabase";

export interface DownloadRequest {
  id: number;
  uid: string;
  country: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DownloadRequestWithUser extends DownloadRequest {
  user_name?: string;
  user_email?: string;
}

export const fetchDownloadRequests = async (): Promise<DownloadRequestWithUser[]> => {
  const { data, error } = await supabase
    .from("download_data_requests")
    .select(`
      *,
      users (
        name,
        email,
        first_name,
        last_name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching download requests:", error);
    return [];
  }

  // Transform the data to flatten user information
  const transformedData = data?.map((request: any) => {
    const userName = request.users?.name || 
                     `${request.users?.first_name || ''} ${request.users?.last_name || ''}`.trim() || 
                     'Unknown';
    return {
      id: request.id,
      uid: request.uid,
      country: request.country,
      status: request.status || 'pending',
      created_at: request.created_at,
      updated_at: request.updated_at,
      user_name: userName,
      user_email: request.users?.email || 'N/A'
    };
  }) || [];

  return transformedData;
};

export const updateRequestStatus = async (
  id: number, 
  status: string
): Promise<DownloadRequest | null> => {
  const { data, error } = await supabase
    .from("download_data_requests")
    .update({ 
      status: status,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating request status:", error);
    return null;
  }

  return data;
};

export const deleteDownloadRequest = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from("download_data_requests")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting download request:", error);
    return false;
  }

  return true;
};

export const getRequestById = async (id: number): Promise<DownloadRequestWithUser | null> => {
  const { data, error } = await supabase
    .from("download_data_requests")
    .select(`
      *,
      users (
        name,
        email,
        first_name,
        last_name
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching request:", error);
    return null;
  }

  const userName = data.users?.name || 
                   `${data.users?.first_name || ''} ${data.users?.last_name || ''}`.trim() || 
                   'Unknown';

  return {
    id: data.id,
    uid: data.uid,
    country: data.country,
    status: data.status || 'pending',
    created_at: data.created_at,
    updated_at: data.updated_at,
    user_name: userName,
    user_email: data.users?.email || 'N/A'
  };
};
