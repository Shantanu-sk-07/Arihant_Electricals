import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { PricingPlan } from '../types';

const KEY = ['pricing'] as const;

async function fetchPlans(): Promise<PricingPlan[]> {
  const { data, error } = await supabase
    .from('pricing_plans')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('kw', { ascending: true });
  if (error) throw error;
  return (data as PricingPlan[]) ?? [];
}

export function usePricing() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: KEY, queryFn: fetchPlans });

  const createPlan = useMutation({
    mutationFn: async (p: Omit<PricingPlan, 'id' | 'created_at'>) => {
      const { error } = await supabase.from('pricing_plans').insert(p);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const updatePlan = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<PricingPlan> }) => {
      const { error } = await supabase.from('pricing_plans').update(patch).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const deletePlan = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('pricing_plans').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  return {
    plans: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    createPlan: createPlan.mutateAsync,
    updatePlan: updatePlan.mutateAsync,
    deletePlan: deletePlan.mutateAsync,
    reload: () => qc.invalidateQueries({ queryKey: KEY }),
  };
}