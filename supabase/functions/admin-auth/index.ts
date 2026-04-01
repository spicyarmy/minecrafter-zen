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
    const { action, password, ...data } = await req.json();
    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");

    if (!password || password !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let result;

    switch (action) {
      case "verify":
        result = { success: true };
        break;

      case "update_setting": {
        const { key, value } = data;
        const { error } = await supabase
          .from("store_settings")
          .update({ value, updated_at: new Date().toISOString() })
          .eq("key", key);
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "get_coupons": {
        const { data: coupons, error } = await supabase
          .from("coupons")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        result = { coupons };
        break;
      }

      case "create_coupon": {
        const { code, discount_percent, expires_at, usage_limit, is_active } = data;
        const { error } = await supabase.from("coupons").insert({
          code,
          discount_percent,
          expires_at: expires_at || null,
          usage_limit: usage_limit || null,
          is_active: is_active ?? true,
        });
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "update_coupon": {
        const { id, ...updates } = data;
        const { error } = await supabase
          .from("coupons")
          .update(updates)
          .eq("id", id);
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "delete_coupon": {
        const { id } = data;
        const { error } = await supabase.from("coupons").delete().eq("id", id);
        if (error) throw error;
        result = { success: true };
        break;
      }

      // Wheel CRUD
      case "get_wheel_items": {
        const { data: items, error } = await supabase
          .from("wheel_items")
          .select("*")
          .order("weight", { ascending: false });
        if (error) throw error;
        result = { items };
        break;
      }

      case "create_wheel_item": {
        const { name, description, value_label, weight, color } = data;
        const { error } = await supabase.from("wheel_items").insert({
          name, description: description || "", value_label: value_label || "",
          weight: weight || 10, color: color || "#ff0066",
        });
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "update_wheel_item": {
        const { id, ...updates } = data;
        updates.updated_at = new Date().toISOString();
        const { error } = await supabase.from("wheel_items").update(updates).eq("id", id);
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "delete_wheel_item": {
        const { id } = data;
        const { error } = await supabase.from("wheel_items").delete().eq("id", id);
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "get_wheel_codes": {
        const { data: codes, error } = await supabase
          .from("wheel_codes")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        result = { codes };
        break;
      }

      case "generate_wheel_codes": {
        const count = Math.min(data.count || 5, 50);
        const newCodes = [];
        for (let i = 0; i < count; i++) {
          const code = "SPIN-" + Math.random().toString(36).substring(2, 8).toUpperCase();
          newCodes.push({ code });
        }
        const { error } = await supabase.from("wheel_codes").insert(newCodes);
        if (error) throw error;
        result = { success: true, count };
        break;
      }

      case "delete_wheel_code": {
        const { id } = data;
        const { error } = await supabase.from("wheel_codes").delete().eq("id", id);
        if (error) throw error;
        result = { success: true };
        break;
      }

      // Pending Commands (Delivery)
      case "get_pending_commands": {
        const { data: commands, error } = await supabase
          .from("pending_commands")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);
        if (error) throw error;
        result = { commands };
        break;
      }

      case "create_pending_command": {
        const { player_name, command, server: cmdServer, product_info } = data;
        const { error } = await supabase.from("pending_commands").insert({
          player_name,
          command,
          server: cmdServer || "gem",
          product_info: product_info || "",
          status: "pending",
        });
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "delete_pending_command": {
        const { id } = data;
        const { error } = await supabase.from("pending_commands").delete().eq("id", id);
        if (error) throw error;
        result = { success: true };
        break;
      }

      // Product CRUD
      case "get_products": {
        const { data: products, error } = await supabase
          .from("products")
          .select("*")
          .order("server", { ascending: true })
          .order("category", { ascending: true })
          .order("sort_order", { ascending: true });
        if (error) throw error;
        result = { products };
        break;
      }

      case "create_product": {
        const { product_key, category, server, name, description, price, original_price, sort_order, metadata } = data;
        const { error } = await supabase.from("products").insert({
          product_key,
          category,
          server,
          name,
          description: description || "",
          price: Number(price),
          original_price: Number(original_price || price),
          sort_order: sort_order || 0,
          metadata: metadata || {},
        });
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "update_product": {
        const { id, ...updates } = data;
        if (updates.price !== undefined) updates.price = Number(updates.price);
        if (updates.original_price !== undefined) updates.original_price = Number(updates.original_price);
        updates.updated_at = new Date().toISOString();
        const { error } = await supabase
          .from("products")
          .update(updates)
          .eq("id", id);
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "delete_product": {
        const { id } = data;
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) throw error;
        result = { success: true };
        break;
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
