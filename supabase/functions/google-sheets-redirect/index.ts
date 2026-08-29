import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GOOGLE_SHEET_URL = Deno.env.get("GOOGLE_SHEET_URL") || "";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    let userData: Record<string, unknown> = {};

    if (req.method === "POST") {
      const body = await req.json();
      userData = body;
    } else if (req.method === "GET") {
      const url = new URL(req.url);
      const params = url.searchParams;
      userData = {
        name: params.get("name") || "",
        phone: params.get("phone") || "",
        email: params.get("email") || "",
        orderId: params.get("orderId") || "",
        action: params.get("action") || "redirect",
      };
    }

    if (!GOOGLE_SHEET_URL) {
      return new Response(
        JSON.stringify({ error: "Google Sheet URL not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === "POST") {
      const sheetResponse = await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!sheetResponse.ok) {
        return new Response(
          JSON.stringify({ error: "Failed to write to Google Sheets" }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "User data saved to Google Sheets" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      const redirectUrl = new URL(GOOGLE_SHEET_URL);
      Object.entries(userData).forEach(([key, value]) => {
        if (value) redirectUrl.searchParams.set(key, String(value));
      });

      return new Response(
        JSON.stringify({ redirectUrl: redirectUrl.toString(), userData }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
