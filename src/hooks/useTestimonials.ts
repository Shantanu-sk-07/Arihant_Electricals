import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Testimonial } from '../types';

const KEY = ['testimonials'] as const;

async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Testimonial[]) ?? [];
}

export function useTestimonials() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: KEY, queryFn: fetchTestimonials });

  const createTestimonial = useMutation({
    mutationFn: async (t: Omit<Testimonial, 'id' | 'created_at'>) => {
      const { error } = await supabase.from('testimonials').insert(t);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const updateTestimonial = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Testimonial> }) => {
      const { error } = await supabase.from('testimonials').update(patch).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const deleteTestimonial = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const uploadTestimonialImage = async (file: File): Promise<string> => {
    const path = `testimonials/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('media').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    return data.publicUrl;
  };

  return {
    testimonials: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    createTestimonial: createTestimonial.mutateAsync,
    updateTestimonial: updateTestimonial.mutateAsync,
    deleteTestimonial: deleteTestimonial.mutateAsync,
    uploadTestimonialImage,
    reload: () => qc.invalidateQueries({ queryKey: KEY }),
  };
}