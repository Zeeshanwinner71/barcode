export async function loader({ request }) {
  const ADMIN_TOKEN = "shpua_91148859cabd2b3ff63727f2f33859ab";
  const shopDomain = "first-123456511.myshopify.com";

  const res = await fetch(
    `https://${shopDomain}/admin/api/2024-10/locations.json`,
    {
      headers: {
        "X-Shopify-Access-Token": ADMIN_TOKEN,
      },
    }
  );

  const data = await res.json();

  return Response.json(data);
}