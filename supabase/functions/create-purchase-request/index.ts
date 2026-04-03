import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { player_name, product_name, product_key, server, quantity, duration, price, coupon } = body;

    if (!player_name || !product_name || !server) {
      return new Response(JSON.stringify({ error: "Missing required fields: player_name, product_name, server" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Look up product to get command_template
    let command = "";
    let productInfo = product_name;

    if (product_key) {
      const { data: product } = await supabase
        .from("products")
        .select("command_template, name")
        .eq("product_key", product_key)
        .eq("server", server)
        .maybeSingle();

      if (product?.command_template) {
        command = product.command_template
          .replace(/\{player\}/g, player_name)
          .replace(/%player_name%/g, player_name)
          .replace(/\{quantity\}/g, String(quantity || 1))
          .replace(/\{days\}/g, String(duration || 30));
      } else {
        // No template found - build a basic command from product name
        const cleanName = (product?.name || product_name).toLowerCase().replace(/\s*(rank|key)\s*/gi, '').trim();
        if (product_name.toLowerCase().includes('key')) {
          command = `crate key give ${player_name} ${cleanName} ${quantity || 1}`;
        } else {
          command = `lp user ${player_name} parent addtemp ${cleanName} ${duration || 30}d`;
        }
      }

      if (product?.name) {
        productInfo = product.name;
      }
    } else {
      // No product_key at all - still build a reasonable command
      const cleanName = product_name.toLowerCase().replace(/\s*(rank|key)\s*/gi, '').trim();
      if (product_name.toLowerCase().includes('key')) {
        command = `crate key give ${player_name} ${cleanName} ${quantity || 1}`;
      } else {
        command = `lp user ${player_name} parent addtemp ${cleanName} ${duration || 30}d`;
      }
    }

    // Build product_info string
    const infoParts = [productInfo];
    if (quantity && quantity > 1) infoParts.push(`x${quantity}`);
    if (duration) infoParts.push(`${duration} days`);
    if (price) infoParts.push(`₹${price}`);
    if (coupon) infoParts.push(`Coupon: ${coupon}`);

    const { error } = await supabase.from("pending_commands").insert({
      player_name,
      command,
      server,
      status: "review",
      product_info: infoParts.join(" | "),
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
