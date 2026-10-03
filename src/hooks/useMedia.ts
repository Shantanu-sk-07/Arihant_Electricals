import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Media } from '../types';

export function useMedia() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('media')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    setMedia((data as Media[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const { data } = await supabase
        .from('media')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (cancelled) return;
      setMedia((data as Media[]) ?? []);
      setLoading(false);
    };

    void run();

    const channelName = `media-rt-${Math.random().toString(36).slice(2)}`;

    const ch = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'media' },
        () => {
          if (!cancelled) void load();
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, [load]);

  const createMedia = async (m: Omit<Media, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('media').insert(m);
    if (error) throw error;
    load();
  };

  const updateMedia = async (id: string, patch: Partial<Media>) => {
    const { error } = await supabase.from('media').update(patch).eq('id', id);
    if (error) throw error;
    load();
  };

  const deleteMedia = async (id: string) => {
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (error) throw error;
    load();
  };

  const uploadFile = async (file: File): Promise<string> => {
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('media').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    return data.publicUrl;
  };

  return {
    media,
    loading,
    createMedia,
    updateMedia,
    deleteMedia,
    uploadFile,
    reload: load,
  };
}