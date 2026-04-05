// Cloudflare Worker for secure OpenAI requests
// Store your key in Cloudflare as a secret named OPENAI_API_KEY.

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    };

    // Handle browser preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const userInput = await request.json();

      // Add a server-side guardrail so off-topic prompts are refused politely.
      const systemMessage = {
        role: "system",
        content:
          "You are the L'Oréal Beauty Assistant. Answer only beauty-related questions about L'Oréal products, routines, ingredients, shades, skin concerns, hair concerns, and recommendations. If a question is unrelated to beauty or L'Oréal topics, politely refuse and invite the user to ask about L'Oréal beauty products or routines.",
      };

      const incomingMessages = Array.isArray(userInput.messages)
        ? userInput.messages
        : [];

      const requestBody = {
        model: "gpt-4o",
        messages: [systemMessage, ...incomingMessages.filter((m) => m.role !== "system")],
        max_completion_tokens: 300,
      };

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: corsHeaders,
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Worker request failed. Check request format and try again.",
          },
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }
  },
};
