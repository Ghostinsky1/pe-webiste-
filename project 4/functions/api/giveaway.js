// Cloudflare Pages Function: giveaway popup entries -> ClickFunnels + Supabase
const CF_WORKSPACE_URL = "https://noanoa.myclickfunnels.com";
const CF_WORKSPACE_ID = 310419;

// Tag name -> ClickFunnels tag ID (created 2026-06-11)
const TAG_IDS = {
  giveaway_entrant: 432412,
  city_denver: 432413,
  city_chicago: 432414,
  city_milwaukee: 432415,
  city_seattle: 432416,
  city_portland: 432417,
  city_pasco: 432418,
  city_greensboro: 432419,
  city_saltlakecity: 432420,
  city_kansascity: 432421,
  city_stlouis: 432422,
  city_nashville: 432423,
  city_unknown: 432424,
};

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  const email = (body.email || "").toLowerCase().trim();
  const firstName = (body.first_name || "").trim().slice(0, 80);
  const phone = (body.phone || "").trim().slice(0, 30);
  const cityTag = TAG_IDS[body.city_tag] ? body.city_tag : "city_unknown";
  const pageUrl = (body.page_url || "").slice(0, 500);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Invalid email format" }, 400);
  }

  // 1) ClickFunnels upsert with giveaway + city tags
  let clickfunnels = "skipped";
  if (env.CLICKFUNNELS_API_TOKEN) {
    try {
      const cfRes = await fetch(
        `${CF_WORKSPACE_URL}/api/v2/workspaces/${CF_WORKSPACE_ID}/contacts/upsert`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.CLICKFUNNELS_API_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "PerreoElectricoSite/1.0",
          },
          body: JSON.stringify({
            contact: {
              email_address: email,
              first_name: firstName || undefined,
              phone_number: phone || undefined,
              tag_ids: [TAG_IDS.giveaway_entrant, TAG_IDS[cityTag]],
              custom_attributes: {
                signup_source: "giveaway_popup",
                signup_page: pageUrl,
                city_interest: cityTag.replace("city_", ""),
              },
            },
          }),
        }
      );
      clickfunnels = cfRes.ok ? "ok" : `error ${cfRes.status}`;
    } catch (e) {
      clickfunnels = `error ${String(e)}`;
    }
  }

  // 2) Also store in Supabase email list (non-blocking)
  try {
    await fetch(`${env.VITE_SUPABASE_URL}/functions/v1/email-signup`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, source: "giveaway_popup" }),
    });
  } catch (e) {
    // ignore - ClickFunnels is the system of record for giveaway entries
  }

  if (clickfunnels === "ok") {
    return json({ success: true });
  }
  return json({ error: "Could not record entry. Please try again.", clickfunnels }, 502);
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
