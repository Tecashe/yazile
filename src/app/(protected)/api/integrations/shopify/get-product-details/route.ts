import { handleIntegrationProxy } from "@/lib/integration-proxy"
import axios from "axios"

// You don't need a new package, axios is sufficient for REST API calls.
export async function POST(req: Request) {
  return handleIntegrationProxy(req, "Shopify", async (decryptedCredentials, payload) => {
    const { accessToken, shopDomain } = {
      accessToken: decryptedCredentials.apiKey, // Mapped from apiKey in your UI
      shopDomain: decryptedCredentials.additionalSettings?.shopDomain,
    }

    if (!accessToken || !shopDomain) {
      throw new Error("Missing Shopify credentials (Access Token or Shop Domain).")
    }

    // Expected payload from Voiceflow:
    // {
    //   "productId": "1234567890", // Or "productHandle": "my-awesome-product"
    // }
    const { productId, productHandle } = payload

    if (!productId && !productHandle) {
      throw new Error("Missing product identifier (productId or productHandle) in payload.")
    }

    let endpoint = ""
    if (productId) {
      endpoint = `/admin/api/2024-04/products/${productId}.json` // Use a specific API version
    } else if (productHandle) {
      // Shopify's REST API doesn't directly support fetching by handle easily.
      // You'd typically fetch all and filter, or use GraphQL.
      // For simplicity, let's assume fetching by ID for now, or a more complex GraphQL query.
      // For a real-world scenario, consider Shopify's GraphQL API for more flexible queries.
      throw new Error(
        "Fetching by product handle is not directly supported via simple REST API for this example. Please use productId.",
      )
    }

    const response = await axios.get(`https://${shopDomain}${endpoint}`, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    })

    const product = response.data.product

    if (!product) {
      throw new Error("Product not found on Shopify.")
    }

    return {
      id: product.id,
      title: product.title,
      description: product.body_html,
      price: product.variants[0]?.price, // Assuming first variant price
      inventory: product.variants[0]?.inventory_quantity, // Assuming first variant inventory
      status: product.status,
      url: `https://${shopDomain}/products/${product.handle}`,
    }
  })
}
