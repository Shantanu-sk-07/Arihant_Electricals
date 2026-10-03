import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Media } from '../types';

const KEY = ['media'] as const;

async function fetchMedia(): Promise<Media[]> {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Media[]) ?? [];
}

export function useMedia() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: KEY, queryFn: fetchMedia });

  const createMedia = useMutation({
    mutationFn: async (m: Omit<Media, 'id' | 'created_at'>) => {
      const { error } = await supabase.from('media').insert(m);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const updateMedia = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Media> }) => {
      const { error } = await supabase.from('media').update(patch).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const deleteMedia = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('media').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const uploadFile = async (file: File): Promise<string> => {
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('media').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    return data.publicUrl;
  };

  return {
    media: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    createMedia: createMedia.mutateAsync,
    updateMedia: updateMedia.mutateAsync,
    deleteMedia: deleteMedia.mutateAsync,
    uploadFile,
    reload: () => qc.invalidateQueries({ queryKey: KEY }),
  };
}