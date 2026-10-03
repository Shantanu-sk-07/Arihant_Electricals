import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { PricingPlan } from '../types';

export function usePricing() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('pricing_plans')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('kw', { ascending: true });
    setPlans((data as PricingPlan[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const { data } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('kw', { ascending: true });
      if (cancelled) return;
      setPlans((data as PricingPlan[]) ?? []);
      setLoading(false);
    };

    void run();

    const channelName = `pricing-rt-${Math.random().toString(36).slice(2)}`;

    const ch = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pricing_plans' },
        () => { if (!cancelled) void load(); }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, [load]);

  const createPlan = async (p: Omit<PricingPlan, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('pricing_plans').insert(p);
    if (error) throw error;
    load();
  };

  const updatePlan = async (id: string, patch: Partial<PricingPlan>) => {
    const { error } = await supabase.from('pricing_plans').update(patch).eq('id', id);
    if (error) throw error;
    load();
  };

  const deletePlan = async (id: string) => {
    const { error } = await supabase.from('pricing_plans').delete().eq('id', id);
    if (error) throw error;
    load();
  };

  return {
    plans,
    loading,
    createPlan,
    updatePlan,
    deletePlan,
    reload: load,
  };
}