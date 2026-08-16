// Cloudflare Pages Function - Dynamic D1 Affiliate Router

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = Record<string, any>>(colName?: string): Promise<T | null>;
  run(): Promise<any>;
  all<T = Record<string, any>>(): Promise<{ results?: T[] }>;
}

interface D1DatabaseBinding {
  prepare(query: string): D1PreparedStatement;
}

interface EventContext {
  env: {
    DB?: D1DatabaseBinding;
  };
  request: Request;
  waitUntil(promise: Promise<any>): void;
}

interface LinkRecord {
  id: number;
  name: string;
  url: string;
}

const FALLBACK_URL = 'https://s.shopee.vn/4Vc2eObMTo';

export async function onRequest(context: EventContext): Promise<Response> {
  const { env, request } = context;
  const url = new URL(request.url);
  const targetCategory = url.searchParams.get('cat');
  const targetPlatform = url.searchParams.get('platform');

  let targetUrl = FALLBACK_URL;
  let linkName = 'default_fallback';
  let linkId: number | null = null;

  if (env && env.DB) {
    try {
      let query = 'SELECT id, name, url FROM affiliate_links WHERE active = 1';
      const params: string[] = [];

      if (targetCategory) {
        query += ' AND category = ?';
        params.push(targetCategory);
      }

      if (targetPlatform) {
        query += ' AND platform = ?';
        params.push(targetPlatform);
      }

      query += ' ORDER BY RANDOM() LIMIT 1;';

      const stmt = params.length > 0 ? env.DB.prepare(query).bind(...params) : env.DB.prepare(query);
      const result = (await stmt.first()) as LinkRecord | null;

      if (result && result.url) {
        targetUrl = result.url;
        linkName = result.name;
        linkId = result.id;

        // Async update clicks counter & track logs in background
        const referrer = request.headers.get('referer') || 'direct';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        if (context.waitUntil && typeof context.waitUntil === 'function') {
          context.waitUntil(
            Promise.allSettled([
              env.DB.prepare("UPDATE affiliate_links SET clicks = clicks + 1, updated_at = datetime('now') WHERE id = ?")
                .bind(linkId)
                .run(),
              env.DB.prepare('INSERT INTO click_tracks (slug, affiliate_name, target_url, referrer, user_agent) VALUES (?, ?, ?, ?, ?)')
                .bind('/go', linkName, targetUrl, referrer, userAgent)
                .run(),
            ])
          );
        }
      }
    } catch (err) {
      console.error('D1 Random Link Query Error:', err);
    }
  }

  // 302 Temporary Redirect to the selected Shopee Link
  return new Response(null, {
    status: 302,
    headers: {
      Location: targetUrl,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      Pragma: 'no-cache',
    },
  });
}
