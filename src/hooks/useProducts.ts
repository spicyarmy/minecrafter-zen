import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  product_key: string;
  category: string;
  server: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  is_active: boolean | null;
  sort_order: number | null;
  metadata: any;
}

export const useProducts = (server?: string, category?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);

      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (server) query = query.eq("server", server);
      if (category) query = query.eq("category", category);

      const { data, error } = await query;

      if (!isMounted) return;

      if (error) {
        console.error("Failed to load products", { server, category, error: error.message });
        setProducts([]);
        setLoading(false);
        return;
      }

      setProducts((data as Product[]) || []);
      setLoading(false);
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [server, category]);

  return { products, loading };
};
