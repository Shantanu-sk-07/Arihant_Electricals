import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { SolarBenefit } from '../types';

const KEY = ['benefits'] as const;

async function fetchBenefits(): Promise<SolarBenefit[]> {
  const { data, error } = await supabase
    .from('solar_benefits')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as SolarBenefit[]) ?? [];
}

export function useBenefits() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: KEY, queryFn: fetchBenefits });

  const createBenefit = useMutation({
    mutationFn: async (b: Omit<SolarBenefit, 'id' | 'created_at'>) => {
      const { error } = await supabase.from('solar_benefits').insert(b);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const updateBenefit = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<SolarBenefit> }) => {
      const { error } = await supabase.from('solar_benefits').update(patch).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const deleteBenefit = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('solar_benefits').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  return {
    benefits: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    createBenefit: createBenefit.mutateAsync,
    updateBenefit: updateBenefit.mutateAsync,
    deleteBenefit: deleteBenefit.mutateAsync,
    reload: () => qc.invalidateQueries({ queryKey: KEY }),
  };
}