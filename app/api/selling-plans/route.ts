import { NextResponse } from "next/server";

const SHOPIFY_DOMAIN = "7fa7b7-42.myshopify.com";
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || "390caf7f28b55c8958daeab3fcd55f76";

export async function GET() {
  const query = `{
    products(first: 10) {
      edges {
        node {
          title
          variants(first: 5) {
            edges {
              node {
                id
                title
                price { amount currencyCode }
              }
            }
          }
          sellingPlanGroups(first: 5) {
            edges {
              node {
                name
                sellingPlans(first: 10) {
                  edges {
                    node {
                      id
                      name
                      options { name value }
                      priceAdjustments {
                        adjustmentValue {
                          ... on SellingPlanPercentagePriceAdjustment {
                            adjustmentPercentage
                          }
                          ... on SellingPlanFixedAmountPriceAdjustment {
                            adjustmentAmount { amount currencyCode }
                          }
                          ... on SellingPlanFixedPriceAdjustment {
                            price { amount currencyCode }
                          }
                        }
                      }
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

  try {
    const res = await fetch(
      `https://${SHOPIFY_DOMAIN}/api/2024-07/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
        },
        body: JSON.stringify({ query }),
      }
    );

    const json = await res.json();
    return NextResponse.json(json, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
