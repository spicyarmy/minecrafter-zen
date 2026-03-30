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

const MAX_RETRIES = 3;
const RETRY_DELAY = 1500;

export const useProducts = (server?: string, category?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchOnce = async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (server) query = query.eq("server", server);
      if (category) query = query.eq("category", category);

      return query;
    };

    const fetchProducts = async () => {
      setLoading(true);
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        const { data, error } = await fetchOnce();
        if (!isMounted) return;
        if (!error && data) {
          setProducts(data as Product[]);
          setLoading(false);
          return;
        }
        if (attempt < MAX_RETRIES - 1) {
          await new Promise(r => setTimeout(r, RETRY_DELAY));
        } else {
          console.error("Failed to load products after retries", { server, category, error: error?.message });
          setProducts([]);
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [server, category]);

  return { products, loading };
};
