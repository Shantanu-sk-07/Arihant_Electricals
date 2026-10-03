import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { SolarBenefit } from '../types';

export function useBenefits() {
  const [benefits, setBenefits] = useState<SolarBenefit[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('solar_benefits')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    setBenefits((data as SolarBenefit[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const { data } = await supabase
        .from('solar_benefits')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (cancelled) return;
      setBenefits((data as SolarBenefit[]) ?? []);
      setLoading(false);
    };

    void run();

    const channelName = `benefits-rt-${Math.random().toString(36).slice(2)}`;

    const ch = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'solar_benefits' },
        () => { if (!cancelled) void load(); }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, [load]);

  const createBenefit = async (b: Omit<SolarBenefit, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('solar_benefits').insert(b);
    if (error) throw error;
    load();
  };

  const updateBenefit = async (id: string, patch: Partial<SolarBenefit>) => {
    const { error } = await supabase.from('solar_benefits').update(patch).eq('id', id);
    if (error) throw error;
    load();
  };

  const deleteBenefit = async (id: string) => {
    const { error } = await supabase.from('solar_benefits').delete().eq('id', id);
    if (error) throw error;
    load();
  };

  return {
    benefits,
    loading,
    createBenefit,
    updateBenefit,
    deleteBenefit,
    reload: load,
  };
}