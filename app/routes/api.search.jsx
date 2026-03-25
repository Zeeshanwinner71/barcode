export async function loader({ request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  const locationId = url.searchParams.get("location");

  const ADMIN_TOKEN = "shpua_91148859cabd2b3ff63727f2f33859ab";
  const shopDomain = "first-123456511.myshopify.com";
  const apiVersion = "2024-10";

  if (!query) {
    return Response.json({ products: [] });
  }

  // 1. Get products
  const productRes = await fetch(
    `https://${shopDomain}/admin/api/${apiVersion}/products.json?limit=5&title=${query}`,
    {
      headers: {
        "X-Shopify-Access-Token": ADMIN_TOKEN,
      },
    }
  );

  const productData = await productRes.json();
  const products = productData.products || [];

  // 2. Attach inventory per location
  for (let product of products) {
    for (let variant of product.variants) {
      const invRes = await fetch(
        `https://${shopDomain}/admin/api/${apiVersion}/inventory_levels.json?inventory_item_ids=${variant.inventory_item_id}&location_ids=${locationId}`,
        {
          headers: {
            "X-Shopify-Access-Token": ADMIN_TOKEN,
          },
        }
      );

      const invData = await invRes.json();
      variant.inventory =
        invData.inventory_levels?.[0]?.available || 0;
    }
  }

  return Response.json({ products });
}