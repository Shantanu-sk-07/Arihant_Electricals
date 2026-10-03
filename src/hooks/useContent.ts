import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { SiteContent } from '../types';

export function useContent(page: string) {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedPage, setLoadedPage] = useState(page);

  const load = useCallback(async () => {
    setError(null);
    const { data, error: loadError } = await supabase
      .from('site_content')
      .select('*')
      .eq('page', page);
    if (loadError) {
      setError(loadError.message);
      setLoadedPage(page);
      setLoading(false);
      throw loadError;
    }
    if (!data) {
      setLoading(false);
      return;
    }
    const map: Record<string, string> = {};
    (data as SiteContent[]).forEach(c => {
      map[`${c.section}.${c.key}`] = c.value ?? '';
    });
    setContent(map);
    setLoadedPage(page);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    let cancelled = false;

    void load().catch((loadError: unknown) => {
      if (cancelled) return;
      setError(loadError instanceof Error ? loadError.message : 'Unable to load page content.');
      setLoading(false);
    });

    const channelName = `content-${page}-rt-${Math.random().toString(36).slice(2)}`;

    const ch = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_content',
          filter: `page=eq.${page}`,
        },
        () => {
          if (!cancelled) {
            void load().catch((loadError: unknown) => {
              if (!cancelled) {
                setError(loadError instanceof Error ? loadError.message : 'Unable to refresh page content.');
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, [page, load]);

  const updateContent = async (
    section: string,
    key: string,
    value: string
  ) => {
    const { error: updateError } = await supabase
      .from('site_content')
      .upsert(
        { page, section, key, value, updated_at: new Date().toISOString() },
        { onConflict: 'page,section,key' }
      );
    if (updateError) throw updateError;
    setContent((current) => ({ ...current, [`${section}.${key}`]: value }));
  };

  const updateContents = async (values: Record<string, string>) => {
    const rows = Object.entries(values).map(([contentKey, value]) => {
      const separator = contentKey.indexOf('.');
      if (separator < 1 || separator === contentKey.length - 1) {
        throw new Error(`Invalid site content key: ${contentKey}`);
      }
      return {
        page,
        section: contentKey.slice(0, separator),
        key: contentKey.slice(separator + 1),
        value,
        updated_at: new Date().toISOString(),
      };
    });
    if (rows.length === 0) return;
    const { error: updateError } = await supabase
      .from('site_content')
      .upsert(rows, { onConflict: 'page,section,key' });
    if (updateError) throw updateError;
    setContent((current) => ({ ...current, ...values }));
  };

  return {
    content,
    loading: loading || loadedPage !== page,
    error,
    updateContent,
    updateContents,
    reload: load,
  };
}