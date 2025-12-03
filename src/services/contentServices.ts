import { supabase } from '../lib/supabase';

export interface Content {
  id: number;
  created_at: string;
  description: string | null;
  type: 'privacy' | 'terms';
}

/**
 * Fetch content by type (privacy or terms)
 */
export const fetchContentByType = async (type: 'privacy' | 'terms'): Promise<Content | null> => {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('type', type)
      .single();

    if (error) {
      // If no content exists yet, return null
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching ${type} content:`, error);
    throw error;
  }
};

/**
 * Update existing content
 */
export const updateContent = async (
  id: number,
  description: string
): Promise<Content> => {
  try {
    const { data, error } = await supabase
      .from('content')
      .update({ description })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
};

/**
 * Create new content
 */
export const createContent = async (
  type: 'privacy' | 'terms',
  description: string
): Promise<Content> => {
  try {
    const { data, error } = await supabase
      .from('content')
      .insert({ type, description })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error creating content:', error);
    throw error;
  }
};

/**
 * Save content (update if exists, create if not)
 */
export const saveContent = async (
  type: 'privacy' | 'terms',
  description: string,
  existingId?: number
): Promise<Content> => {
  try {
    if (existingId) {
      return await updateContent(existingId, description);
    } else {
      return await createContent(type, description);
    }
  } catch (error) {
    console.error('Error saving content:', error);
    throw error;
  }
};
