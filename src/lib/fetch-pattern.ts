const RAW_BASE = 'https://raw.githubusercontent.com/dar-kow/cdat-pattern/main';

export async function fetchPatternFile(path: string, fallback: string): Promise<string> {
  const url = `${RAW_BASE}/${path.replace(/^\/+/, '')}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[fetch-pattern] ${url} → ${res.status}, using fallback`);
      return fallback;
    }
    return await res.text();
  } catch (err) {
    console.warn(`[fetch-pattern] ${url} → error ${(err as Error).message}, using fallback`);
    return fallback;
  }
}
