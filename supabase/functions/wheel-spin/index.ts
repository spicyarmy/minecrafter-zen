import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1459835220290441345/25r77rdGny-cj81NCY1ivV5l8C5Z78f9MswpNtg6l9peOEpr-EF55Is7cmTiAAEUfFht";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, username } = await req.json();

    if (!code || !username) {
      return new Response(JSON.stringify({ error: "Code aur username dono chahiye!" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Validate code
    const { data: codeRow, error: codeErr } = await supabase
      .from("wheel_codes")
      .select("*")
      .eq("code", code)
      .single();

    if (codeErr || !codeRow) {
      return new Response(JSON.stringify({ error: "Invalid code! Ye code galat hai." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (codeRow.is_used) {
      return new Response(JSON.stringify({ error: "Code already used! Ye code pehle se use ho chuka hai." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get active items
    const { data: items, error: itemsErr } = await supabase
      .from("wheel_items")
      .select("*")
      .eq("is_active", true);

    if (itemsErr || !items || items.length === 0) {
      return new Response(JSON.stringify({ error: "No wheel items available!" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Weighted random pick
    const totalWeight = items.reduce((sum: number, i: any) => sum + (i.weight || 1), 0);
    let random = Math.random() * totalWeight;
    let picked = items[0];
    for (const item of items) {
      random -= (item.weight || 1);
      if (random <= 0) {
        picked = item;
        break;
      }
    }

    // Mark code as used
    await supabase
      .from("wheel_codes")
      .update({
        is_used: true,
        used_by: username,
        won_item: picked.name,
        used_at: new Date().toISOString(),
      })
      .eq("id", codeRow.id);

    // Send to Discord
    try {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [{
            title: "🎡 Lucky Wheel Spin!",
            color: 0xff00aa,
            fields: [
              { name: "👤 Player", value: username, inline: true },
              { name: "🎁 Won", value: picked.name, inline: true },
              { name: "💰 Value", value: picked.value_label || "N/A", inline: true },
              { name: "🔑 Code Used", value: code, inline: true },
            ],
            timestamp: new Date().toISOString(),
          }],
        }),
      });
    } catch {
      // Discord send failure is non-critical
    }

    return new Response(JSON.stringify({
      success: true,
      won_item_id: picked.id,
      won_item_name: picked.name,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
