import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Testimonial } from '../types';

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    setTestimonials((data as Testimonial[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (cancelled) return;
      setTestimonials((data as Testimonial[]) ?? []);
      setLoading(false);
    };

    void run();

    const channelName = `testimonials-rt-${Math.random().toString(36).slice(2)}`;

    const ch = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'testimonials' },
        () => { if (!cancelled) void load(); }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, [load]);

  const createTestimonial = async (t: Omit<Testimonial, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('testimonials').insert(t);
    if (error) throw error;
    load();
  };

  const updateTestimonial = async (id: string, patch: Partial<Testimonial>) => {
    const { error } = await supabase.from('testimonials').update(patch).eq('id', id);
    if (error) throw error;
    load();
  };

  const deleteTestimonial = async (id: string) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
    load();
  };

  const uploadTestimonialImage = async (file: File): Promise<string> => {
    const path = `testimonials/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('media').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    return data.publicUrl;
  };

  return {
    testimonials,
    loading,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    uploadTestimonialImage,
    reload: load,
  };
}