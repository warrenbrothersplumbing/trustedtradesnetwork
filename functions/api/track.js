export async function onRequest(context) {
  const { request, env } = context;
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Track a click
  if (request.method === 'POST') {
    try {
      const data = await request.json();
      const { company, type, phone } = data;
      
      if (!company || !type) {
        return new Response(JSON.stringify({ error: 'Missing company or type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Get current date for daily tracking
      const today = new Date().toISOString().split('T')[0];
      const key = `clicks:${company}:${type}:${today}`;
      
      // Get existing count or start at 0
      let count = 0;
      if (env.CLICK_TRACKING) {
        const existing = await env.CLICK_TRACKING.get(key);
        count = existing ? parseInt(existing, 10) : 0;
      }
      
      // Increment and store
      count++;
      if (env.CLICK_TRACKING) {
        await env.CLICK_TRACKING.put(key, count.toString());
        
        // Also update total count
        const totalKey = `clicks:${company}:${type}:total`;
        const existingTotal = await env.CLICK_TRACKING.get(totalKey);
        const total = existingTotal ? parseInt(existingTotal, 10) + 1 : 1;
        await env.CLICK_TRACKING.put(totalKey, total.toString());
      }

      return new Response(JSON.stringify({ success: true, count }), {
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

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}
