import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Service } from '../types';

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    setServices((data as Service[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const { data } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (cancelled) return;
      setServices((data as Service[]) ?? []);
      setLoading(false);
    };

    void run();

    const channelName = `services-rt-${Math.random().toString(36).slice(2)}`;

    const ch = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'services' },
        () => { if (!cancelled) void load(); }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, [load]);

  const createService = async (s: Omit<Service, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('services').insert(s);
    if (error) throw error;
    load();
  };

  const updateService = async (id: string, patch: Partial<Service>) => {
    const { error } = await supabase.from('services').update(patch).eq('id', id);
    if (error) throw error;
    load();
  };

  const deleteService = async (id: string) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
    load();
  };

  const uploadServiceImage = async (file: File): Promise<string> => {
    const path = `services/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('media').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    return data.publicUrl;
  };

  return {
    services,
    loading,
    createService,
    updateService,
    deleteService,
    uploadServiceImage,
    reload: load,
  };
}