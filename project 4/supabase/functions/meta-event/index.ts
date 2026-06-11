import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PIXEL_ID = "1672659623595525";
const META_API_VERSION = "v19.0";
const META_API_URL = `https://graph.facebook.com/${META_API_VERSION}/${PIXEL_ID}/events`;

interface EventPayload {
  event_name: string;
  event_id?: string;
  event_source_url?: string;
  user_agent?: string;
  ip?: string;
  fbc?: string;
  fbp?: string;
  custom_data?: Record<string, unknown>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get("META_ACCESS_TOKEN");
    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: "Meta access token not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload: EventPayload = await req.json();
    const timestamp = Math.floor(Date.now() / 1000);

    const eventData = {
      event_name: payload.event_name || "PageView",
      event_time: timestamp,
      event_id: payload.event_id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      event_source_url: payload.event_source_url || "",
      action_source: "website",
      user_data: {
        client_ip_address: payload.ip || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
        client_user_agent: payload.user_agent || req.headers.get("user-agent") || "",
        fbc: payload.fbc || "",
        fbp: payload.fbp || "",
      },
      custom_data: payload.custom_data || {},
    };

    const response = await fetch(`${META_API_URL}?access_token=${accessToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [eventData],
      }),
    });

    const result = await response.json();

    return new Response(JSON.stringify({ success: true, meta_response: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
