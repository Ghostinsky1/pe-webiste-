// Cloudflare Pages Function: Laylo-style drop page phone capture -> ClickFunnels
const CF_WORKSPACE_URL = "https://noanoa.myclickfunnels.com";
const CF_WORKSPACE_ID = 310419;

const TAG_IDS = {
  drop_signup: 439986,
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

  const digits = (body.phone || "").replace(/[^\d+]/g, "");
  if (digits.replace(/\D/g, "").length < 10) {
    return json({ error: "Invalid phone number" }, 400);
  }
  const phone = digits.startsWith("+") ? digits : (digits.length === 10 ? "+1" + digits : "+" + digits);
  const cityTag = TAG_IDS[body.city_tag] ? body.city_tag : "city_unknown";

  if (!env.CLICKFUNNELS_API_TOKEN) {
    return json({ error: "Not configured" }, 502);
  }

  try {
    const cfRes = await fetch(
      `${CF_WORKSPACE_URL}/api/v2/workspaces/${CF_WORKSPACE_ID}/contacts`,
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
            phone_number: phone,
            tag_ids: [TAG_IDS.drop_signup, TAG_IDS[cityTag]],
            custom_attributes: {
              signup_source: "drop_page",
              signup_page: (body.page_url || "").slice(0, 500),
              city_interest: cityTag.replace("city_", ""),
              show_slug: (body.show_slug || "").slice(0, 120),
            },
          },
        }),
      }
    );
    if (cfRes.ok) return json({ success: true });
    return json({ error: `ClickFunnels error ${cfRes.status}` }, 502);
  } catch (e) {
    return json({ error: String(e) }, 502);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
