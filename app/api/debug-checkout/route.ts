import { NextResponse } from "next/server";

const SHOPIFY_DOMAIN = "7fa7b7-42.myshopify.com";
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || "390caf7f28b55c8958daeab3fcd55f76";

// Fetch the REAL selling plan IDs from Shopify Storefront API
async function fetchSellingPlans() {
  const query = `{
    products(first: 10) {
      edges {
        node {
          title
          id
          sellingPlanGroups(first: 5) {
            edges {
              node {
                name
                appName
                sellingPlans(first: 10) {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;

  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query }),
  });

  return res.json();
}

// Test creating a cart with a selling plan to see if it works
async function testCartCreate(variantId: string, sellingPlanId: string) {
  const mutation = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          lines(first: 5) {
            edges {
              node {
                merchandise {
                  ... on ProductVariant { id title }
                }
                sellingPlanAllocation {
                  sellingPlan { id name }
                }
                quantity
                cost {
                  totalAmount { amount currencyCode }
                }
              }
            }
          }
        }
        userErrors { field message }
      }
    }
  `;

  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        input: {
          lines: [{
            merchandiseId: variantId,
            quantity: 1,
            sellingPlanId: sellingPlanId,
          }],
        },
      },
    }),
  });

  return res.json();
}

export async function GET() {
  const hardcodedPlans = {
    "2_weeks": "gid://shopify/SellingPlan/4014735434",
    "4_weeks": "gid://shopify/SellingPlan/4014768202",
    "6_weeks": "gid://shopify/SellingPlan/4014800970",
  };

  const strawberryVariant = "gid://shopify/ProductVariant/42739482067018";

  try {
    // Step 1: Fetch real selling plans from Shopify
    const plansData = await fetchSellingPlans();

    // Step 2: Test cartCreate with the 2-week selling plan
    const testResult = await testCartCreate(strawberryVariant, hardcodedPlans["2_weeks"]);

    // Step 3: Generate the cart permalink that would be used
    const cartPermalink = `https://${SHOPIFY_DOMAIN}/cart/42739482067018:1?selling_plan=4014735434`;

    return NextResponse.json({
      step1_selling_plans_from_shopify: plansData,
      step2_cart_create_test: testResult,
      step3_cart_permalink: cartPermalink,
      step4_hardcoded_ids: hardcodedPlans,
      step5_check: "Compare step1 IDs with step4 IDs. If they don't match, update CartContext.tsx SELLING_PLANS.",
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
