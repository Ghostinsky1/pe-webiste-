// Cloudflare Pages Function: relays email signups to Supabase AND ClickFunnels
const CF_WORKSPACE_URL = "https://noanoa.myclickfunnels.com";
const CF_WORKSPACE_ID = 310419;
const CF_TAG_ID = 432396; // "PE Website Signup" tag

export async function onRequestPost(context) {
const { request, env } = context;

let body;
try {
body = await request.json();
} catch {
return json({ error: "Invalid request" }, 400);
}

const email = (body.email || "").toLowerCase().trim();
const source = body.source || "website";

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
return json({ error: "Invalid email format" }, 400);
}

// 1) Save to Supabase (existing behavior - source of truth for the site)
let supabaseResult = { ok: false };
try {
const res = await fetch(`${env.VITE_SUPABASE_URL}/functions/v1/email-signup`, {
method: "POST",
headers: {
Authorization: `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
"Content-Type": "application/json",
},
body: JSON.stringify({ email, source }),
});
supabaseResult = { ok: res.ok, status: res.status, data: await res.json() };
} catch (e) {
supabaseResult = { ok: false, error: String(e) };
}

// 2) Upsert contact in ClickFunnels with the automation tag
let clickfunnels = "skipped";
if (env.CLICKFUNNELS_API_TOKEN) {
try {
const cfRes = await fetch(`${CF_WORKSPACE_URL}/api/v2/workspaces/${CF_WORKSPACE_ID}/contacts/upsert`, {
method: "POST",
headers: {
Authorization: `Bearer ${env.CLICKFUNNELS_API_TOKEN}`,
"Content-Type": "application/json",
Accept: "application/json",
},
body: JSON.stringify({ contact: { email_address: email, tag_ids: [CF_TAG_ID] } }),
});
clickfunnels = cfRes.ok ? "ok" : `error ${cfRes.status}`;
} catch (e) {
clickfunnels = `error ${String(e)}`;
}
}

if (supabaseResult.ok || clickfunnels === "ok") {
return json({ success: true, clickfunnels });
}
return json({ error: "Failed to subscribe. Please try again." }, 502);
}

function json(obj, status = 200) {
return new Response(JSON.stringify(obj), {
status,
headers: { "Content-Type": "application/json" },
});
}
