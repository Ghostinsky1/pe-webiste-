import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PIXEL_ID = "CNK9VM3C77UE62BN7IS0";
const TIKTOK_API_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/";

interface EventPayload {
  event: string;
  event_id?: string;
  url?: string;
  referrer?: string;
  user_agent?: string;
  ip?: string;
  properties?: Record<string, unknown>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get("TIKTOK_ACCESS_TOKEN");
    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: "TikTok access token not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload: EventPayload = await req.json();
    const timestamp = Math.floor(Date.now() / 1000);

    const eventData = {
      pixel_code: PIXEL_ID,
      event: payload.event || "PageView",
      event_id: payload.event_id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: timestamp,
      context: {
        page: {
          url: payload.url || "",
          referrer: payload.referrer || "",
        },
        user_agent: payload.user_agent || req.headers.get("user-agent") || "",
        ip: payload.ip || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
      },
      properties: payload.properties || {},
    };

    const response = await fetch(TIKTOK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": accessToken,
      },
      body: JSON.stringify({
        pixel_code: PIXEL_ID,
        event: "batch",
        event_id: eventData.event_id,
        timestamp: timestamp,
        batch: [eventData],
      }),
    });

    const result = await response.json();

    return new Response(JSON.stringify({ success: true, tiktok_response: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
