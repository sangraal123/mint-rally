import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { ethers } from "ethers";
import MintRallyForwarderABI from "../../../contracts/Fowarder.json";

// Config
const RELAYER_ID = "sepolia-example";
const RELAYER_TRANSACTION_ENDPOINT = `http://34.97.56.160:8080/api/v1/relayers/${RELAYER_ID}/transactions`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") res.status(404).end();

  try {
    console.log("Processing custom relay request...", req.body);
    const { request, signature } = req.body;

    // 1. Get API Key for Authorization Header
    let apiKey = "";
    try {
      const apiKeys = JSON.parse(process.env.OZ_RELAYER_API_KEYS || "[]");
      if (Array.isArray(apiKeys) && apiKeys.length > 0) {
        apiKey = apiKeys[0];
      } else {
        apiKey = process.env.OZ_RELAYER_API_KEYS || "";
      }
    } catch (e) {
      apiKey = process.env.OZ_RELAYER_API_KEYS || "";
    }
    apiKey = apiKey.replace(/['"\[\]]/g, '');

    if (!apiKey) throw new Error("Missing Relayer API Key");

    // 2. Encode the function call: forwarder.execute(request, signature)
    const forwarderInterface = new ethers.utils.Interface(MintRallyForwarderABI.abi);
    const encodedData = forwarderInterface.encodeFunctionData("execute", [request, signature]);

    // 3. Construct payload
    // URL: /api/v1/relayers/transactions
    // Header: Authorization: Bearer <KEY>

    const payload = {
      to: process.env.NEXT_PUBLIC_FORWARDER_ADDRESS,
      data: encodedData,
      value: "0",
      gasLimit: 5000000,
      speed: "fast"
    };

    console.log("Sending Transaction to:", RELAYER_TRANSACTION_ENDPOINT);
    // console.log("Payload:", JSON.stringify(payload, null, 2));

    const response = await axios.post(RELAYER_TRANSACTION_ENDPOINT, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    console.log("Relayer Response:", response.data);

    const result = {
      tx: response.data
    };

    res.status(200).json(result);

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
