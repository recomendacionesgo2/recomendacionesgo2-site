import fetch from "node-fetch";

export async function handler(event) {
  const client_id = "0v231ihBC5sFL2kZZ5ap"; // tu Client ID
  const client_secret = "PON_AQUI_TU_CLIENT_SECRET"; // ⚠️ sustituye por tu Client Secret real
  const code = event.queryStringParameters.code;

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing code parameter" }),
    };
  }

  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams({
        client_id,
        client_secret,
        code,
      }),
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Authentication failed", details: error.message }),
    };
  }
}
