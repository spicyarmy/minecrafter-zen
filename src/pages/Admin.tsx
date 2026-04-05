import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Server, Tag, CreditCard, LogOut, Percent, Package, Dices, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminServers from "@/components/admin/AdminServers";
import AdminDiscounts from "@/components/admin/AdminDiscounts";
import AdminCoupons from "@/components/admin/AdminCoupons";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminWheel from "@/components/admin/AdminWheel";
import AdminDelivery from "@/components/admin/AdminDelivery";
import { toast } from "sonner";

const TABS = [
  { id: "products", label: "Products", icon: Package },
  { id: "delivery", label: "Delivery", icon: Send },
  { id: "wheel", label: "Lucky Wheel", icon: Dices },
  { id: "servers", label: "Servers", icon: Server },
  { id: "discounts", label: "Discounts", icon: Percent },
  { id: "coupons", label: "Coupons", icon: Tag },
] as const;

type TabId = typeof TABS[number]["id"];

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("products");
  const [settings, setSettings] = useState<Record<string, any>>({});

  const adminCall = useCallback(async (action: string, data: any = {}) => {
    const storedPassword = sessionStorage.getItem("admin_pwd");
    if (!storedPassword) {
      throw new Error("Please login again");
    }

    const res = await supabase.functions.invoke("admin-auth", {
      body: { action, password: storedPassword, ...data },
    });

    // Handle both success and error responses
    if (res.data?.error) throw new Error(res.data.error);
    if (res.error && !res.data) {
      // Try to get error message from the response
      let msg = res.error.message;
      try {
        const ctx = await (res.error as any)?.context?.json?.();
        if (ctx?.error) msg = ctx.error;
      } catch {}
      throw new Error(msg);
    }
    return res.data;
  }, []);

  const loadSettings = useCallback(async () => {
    const { data } = await supabase.from("store_settings").select("*");
    if (data) {
      const map: Record<string, any> = {};
      data.forEach((s: any) => { map[s.key] = s.value; });
      setSettings(map);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadSettings();
    }
  }, [isAuthenticated, loadSettings]);

  useEffect(() => {
    const verifyStoredSession = async () => {
      const storedPassword = sessionStorage.getItem("admin_pwd");

      if (!storedPassword) {
        setIsCheckingSession(false);
        return;
      }

      try {
        const res = await supabase.functions.invoke("admin-auth", {
          body: { action: "verify", password: storedPassword },
        });

        // If data.success exists, the password is valid
        if (res.data?.success) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem("admin_pwd");
          setIsAuthenticated(false);
        }
      } catch {
        sessionStorage.removeItem("admin_pwd");
        setIsAuthenticated(false);
      } finally {
        setIsCheckingSession(false);
      }
    };

    verifyStoredSession();
  }, []);

  useEffect(() => {
    const onStorage = () => {
      if (!sessionStorage.getItem("admin_pwd")) {
        setIsAuthenticated(false);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogin = async () => {
    setIsAuthenticated(true);
    try {
      await loadSettings();
    } catch (error: any) {
      toast.error(error?.message || "Settings load failed");
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass rounded-3xl px-6 py-5 border border-border/50 font-display text-sm tracking-wider text-muted-foreground">
          Checking admin access...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="font-display text-lg font-bold gradient-text">ADMIN PANEL</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              sessionStorage.removeItem("admin_pwd");
              setIsAuthenticated(false);
            }}
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display text-sm tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsla(320,100%,50%,0.4)]"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "products" && <AdminProducts adminCall={adminCall} />}
            {activeTab === "delivery" && <AdminDelivery adminCall={adminCall} />}
            {activeTab === "wheel" && <AdminWheel adminCall={adminCall} />}
            {activeTab === "servers" && <AdminServers settings={settings} setSettings={setSettings} adminCall={adminCall} />}
            {activeTab === "discounts" && <AdminDiscounts settings={settings} setSettings={setSettings} adminCall={adminCall} />}
            {activeTab === "coupons" && <AdminCoupons adminCall={adminCall} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
