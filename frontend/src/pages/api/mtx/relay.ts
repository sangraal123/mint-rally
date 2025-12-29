import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// Environment variables for custom relayer
// OZ_RELAYER_API_KEYS is used as the API Key storage for compatibility
const RELAYER_API_URL = "http://34.97.56.160:8080/api/v1/relayers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") res.status(404).end();

  try {
    console.log("Processing custom relay request...", req.body);
    const { request, signature } = req.body;

    // Parse the API Key from the existing env var structure (array of strings or raw string)
    let apiKey = "";
    try {
      const apiKeys = JSON.parse(process.env.OZ_RELAYER_API_KEYS || "[]");
      if (Array.isArray(apiKeys) && apiKeys.length > 0) {
        apiKey = apiKeys[0];
      } else {
        apiKey = process.env.OZ_RELAYER_API_KEYS || "";
      }
    } catch (e) {
      // If not JSON, assumes it's a direct string
      apiKey = process.env.OZ_RELAYER_API_KEYS || "";
    }

    // Clean up the key if it accidentally contains quotes or brackets from manual entry errors
    apiKey = apiKey.replace(/['"\[\]]/g, '');

    const payload = {
      request: request,
      signature: signature,
      metadata: {
        signatureType: 'EIP712_V4'
      }
    };

    console.log("Sending to Custom Relayer:", RELAYER_API_URL);

    const response = await axios.post(RELAYER_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    console.log("Relayer Response:", response.data);
    res.status(200).json(response.data);

  } catch (error: any) {
    console.error("Custom Relay Error:", error.message);
    if (error.response) {
      console.error("Relayer Response Error:", error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}
