import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { SiteContent } from '../types';

const key = (page: string) => ['content', page] as const;

async function fetchContent(page: string): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('page', page);
  if (error) throw error;
  const map: Record<string, string> = {};
  (data as SiteContent[] | null)?.forEach((c) => {
    map[`${c.section}.${c.key}`] = c.value ?? '';
  });
  return map;
}

export function useContent(page: string) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: key(page),
    queryFn: () => fetchContent(page),
  });

  const updateContents = useMutation({
    mutationFn: async (values: Record<string, string>) => {
      const rows = Object.entries(values).map(([contentKey, value]) => {
        const sep = contentKey.indexOf('.');
        if (sep < 1 || sep === contentKey.length - 1) {
          throw new Error(`Invalid site content key: ${contentKey}`);
        }
        return {
          page,
          section: contentKey.slice(0, sep),
          key: contentKey.slice(sep + 1),
          value,
          updated_at: new Date().toISOString(),
        };
      });
      if (!rows.length) return;
      const { error } = await supabase
        .from('site_content')
        .upsert(rows, { onConflict: 'page,section,key' });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key(page) }),
  });

  const updateContent = async (section: string, k: string, value: string) => {
    await updateContents.mutateAsync({ [`${section}.${k}`]: value });
  };

  return {
    content: query.data ?? {},
    loading: query.isLoading,
    error: query.error,
    updateContent,
    updateContents: updateContents.mutateAsync,
    reload: () => qc.invalidateQueries({ queryKey: key(page) }),
  };
}