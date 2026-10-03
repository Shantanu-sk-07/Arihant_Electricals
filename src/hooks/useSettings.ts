import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { SiteSetting } from '../types';

const KEY = ['settings'] as const;

async function fetchSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('site_settings').select('*');
  if (error) throw error;
  const map: Record<string, string> = {};
  (data as SiteSetting[] | null)?.forEach((s) => {
    map[s.key] = s.value ?? '';
  });
  return map;
}

export function useSettings() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: KEY, queryFn: fetchSettings });

  const updateSettings = useMutation({
    mutationFn: async (values: Record<string, string>) => {
      const rows = Object.entries(values).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }));
      if (!rows.length) return;
      const { error } = await supabase
        .from('site_settings')
        .upsert(rows, { onConflict: 'key' });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const updateSetting = async (key: string, value: string) => {
    await updateSettings.mutateAsync({ [key]: value });
  };

  return {
    settings: query.data ?? {},
    loading: query.isLoading,
    error: query.error,
    updateSetting,
    updateSettings: updateSettings.mutateAsync,
    reload: () => qc.invalidateQueries({ queryKey: KEY }),
  };
}