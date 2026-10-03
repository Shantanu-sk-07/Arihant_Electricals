import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Service } from '../types';

const KEY = ['services'] as const;

async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Service[]) ?? [];
}

export function useServices() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: KEY, queryFn: fetchServices });

  const createService = useMutation({
    mutationFn: async (s: Omit<Service, 'id' | 'created_at'>) => {
      const { error } = await supabase.from('services').insert(s);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const updateService = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Service> }) => {
      const { error } = await supabase.from('services').update(patch).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const uploadServiceImage = async (file: File): Promise<string> => {
    const path = `services/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('media').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    return data.publicUrl;
  };

  return {
    services: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    createService: createService.mutateAsync,
    updateService: updateService.mutateAsync,
    deleteService: deleteService.mutateAsync,
    uploadServiceImage,
    reload: () => qc.invalidateQueries({ queryKey: KEY }),
  };
}