const apiKey = process.env.PROXYAPI_API_KEY;
const baseUrl = (process.env.PROXYAPI_BASE_URL || "https://openai.api.proxyapi.ru/v1").replace(/\/$/, "");
const model = process.env.PROXYAPI_AUDIT_MODEL || "gpt-5.4-mini";

if (!apiKey) {
  console.error("PROXYAPI_API_KEY is not set");
  process.exit(1);
}

const response = await fetch(`${baseUrl}/responses`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model,
    input: [
      {
        role: "system",
        content: "Верни только JSON."
      },
      {
        role: "user",
        content: "Верни объект {\"ok\":true,\"provider\":\"proxyapi\"}."
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "proxyapi_smoke_test",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["ok", "provider"],
          properties: {
            ok: { type: "boolean" },
            provider: { type: "string" }
          }
        }
      }
    }
  })
});

const text = await response.text();
console.log(`STATUS ${response.status}`);
console.log(text.slice(0, 2000));

if (!response.ok) {
  process.exit(1);
}
