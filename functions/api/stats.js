export async function onRequest(context) {
  const { request, env } = context;
  
  // Simple auth check - you can set this in Cloudflare dashboard
  const url = new URL(request.url);
  const authKey = url.searchParams.get('key');
  
  // Set your secret key in Cloudflare environment variables
  if (env.STATS_KEY && authKey !== env.STATS_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!env.CLICK_TRACKING) {
    return new Response(JSON.stringify({ 
      error: 'KV namespace not configured',
      setup: 'Create a KV namespace called CLICK_TRACKING in Cloudflare dashboard'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // List all keys to get stats
    const list = await env.CLICK_TRACKING.list();
    const stats = {};

    for (const key of list.keys) {
      const value = await env.CLICK_TRACKING.get(key.name);
      const parts = key.name.split(':');
      // Format: clicks:company:type:date or clicks:company:type:total
      if (parts.length === 4) {
        const [, company, type, dateOrTotal] = parts;
        
        if (!stats[company]) {
          stats[company] = { phone: { total: 0, daily: {} }, website: { total: 0, daily: {} } };
        }
        
        if (dateOrTotal === 'total') {
          stats[company][type].total = parseInt(value, 10);
        } else {
          stats[company][type].daily[dateOrTotal] = parseInt(value, 10);
        }
      }
    }

    return new Response(JSON.stringify({ stats, generated: new Date().toISOString() }, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
