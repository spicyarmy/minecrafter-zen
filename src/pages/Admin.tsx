import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Server, Tag, CreditCard, LogOut, Percent, Package, Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminServers from "@/components/admin/AdminServers";
import AdminDiscounts from "@/components/admin/AdminDiscounts";
import AdminCoupons from "@/components/admin/AdminCoupons";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminWheel from "@/components/admin/AdminWheel";

const TABS = [
  { id: "products", label: "Products", icon: Package },
  { id: "wheel", label: "Lucky Wheel", icon: Dices },
  { id: "servers", label: "Servers", icon: Server },
  { id: "discounts", label: "Discounts", icon: Percent },
  { id: "coupons", label: "Coupons", icon: Tag },
] as const;

type TabId = typeof TABS[number]["id"];

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("products");
  const [settings, setSettings] = useState<Record<string, any>>({});

  const adminCall = useCallback(async (action: string, data: any = {}) => {
    const storedPassword = sessionStorage.getItem("admin_pwd");
    const res = await supabase.functions.invoke("admin-auth", {
      body: { action, password: storedPassword, ...data },
    });
    if (res.error) throw new Error(res.error.message);
    if (res.data?.error) throw new Error(res.data.error);
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

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
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
