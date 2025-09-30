import axios from "axios";

const DB_BASE_URL = "https://db.omshejul.com";
const DB_TOKEN = process.env.DB_TOKEN;

interface TokenResponse {
  items: Array<{
    id: string;
    key: string;
    value: string;
    // Add other fields as needed
  }>;
}

let cachedToken: string | null = null;
let tokenCacheExpiry: number | null = null;
const TOKEN_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const clearTokenCache = () => {
  cachedToken = null;
  tokenCacheExpiry = null;
  console.log("Token cache cleared");
};

export const getBearerToken = async (): Promise<string> => {
  console.log("Getting bearer token...");

  // Check if we have a valid cached token
  if (cachedToken && tokenCacheExpiry && Date.now() < tokenCacheExpiry) {
    console.log(
      "Returning cached token, valid for",
      Math.round((tokenCacheExpiry - Date.now()) / 1000),
      "more seconds"
    );
    return cachedToken;
  }

  if (!DB_TOKEN) {
    console.error("DB_TOKEN environment variable not found");
    throw new Error("DB_TOKEN environment variable is not set");
  }

  try {
    console.log("Fetching new token from database...");
    const response = await axios.get<TokenResponse>(
      `${DB_BASE_URL}/api/collections/keys/records?filter=(key="solar-key")`,
      {
        headers: {
          Authorization: `Bearer ${DB_TOKEN}`,
        },
      }
    );

    if (!response.data.items || response.data.items.length === 0) {
      console.error("No token found in database response");
      throw new Error("No token found in database for key 'solar-key'");
    }

    const token = response.data.items[0].value;
    console.log("Successfully retrieved new token:", token);

    // Cache the token
    cachedToken = token;
    tokenCacheExpiry = Date.now() + TOKEN_CACHE_DURATION;
    console.log("Token cached for", TOKEN_CACHE_DURATION / 1000, "seconds");

    return token;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching token from database:", errorMessage);
    throw new Error(`Failed to fetch token: ${errorMessage}`);
  }
};
