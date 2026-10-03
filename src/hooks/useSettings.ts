import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { SiteSetting } from '../types';

export function useSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: loadError } = await supabase.from('site_settings').select('*');
    if (loadError) {
      setError(loadError.message);
      setLoading(false);
      throw loadError;
    }
    const map: Record<string, string> = {};
    (data as SiteSetting[] | null)?.forEach(s => {
      map[s.key] = s.value ?? '';
    });
    setSettings(map);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void load().catch(() => {
      if (cancelled) return;
      setLoading(false);
    });

    const channelName = `settings-rt-${Math.random().toString(36).slice(2)}`;

    const ch = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        () => {
          if (!cancelled) void load().catch(() => undefined);
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, [load]);

  const updateSetting = async (key: string, value: string) => {
    const { error: updateError } = await supabase
      .from('site_settings')
      .upsert(
        { key, value, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );
    if (updateError) throw updateError;
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const updateSettings = async (values: Record<string, string>) => {
    const rows = Object.entries(values).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }));
    if (!rows.length) return;
    const { error: updateError } = await supabase
      .from('site_settings')
      .upsert(rows, { onConflict: 'key' });
    if (updateError) throw updateError;
    setSettings((current) => ({ ...current, ...values }));
  };

  return { settings, loading, error, updateSetting, updateSettings, reload: load };
}