import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const DELIVERY_SECRET = Deno.env.get("DELIVERY_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const url = new URL(req.url);

    // GET: Plugin polls for pending commands
    if (req.method === "GET") {
      const secret = url.searchParams.get("secret");
      const server = url.searchParams.get("server") || "gem";

      if (!secret || secret !== DELIVERY_SECRET) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: commands, error } = await supabase
        .from("pending_commands")
        .select("id, command, player_name")
        .eq("server", server)
        .eq("status", "pending")
        .order("created_at", { ascending: true })
        .limit(20);

      if (error) throw error;

      return new Response(JSON.stringify({ commands: commands || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: Plugin confirms command executed
    if (req.method === "POST") {
      const body = await req.json();
      const { secret, id, status: cmdStatus } = body;

      if (!secret || secret !== DELIVERY_SECRET) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!id) {
        return new Response(JSON.stringify({ error: "Missing command id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const newStatus = cmdStatus === "failed" ? "failed" : "executed";

      const { error } = await supabase
        .from("pending_commands")
        .update({
          status: newStatus,
          executed_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
