import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Server, Tag, CreditCard, Lock, LogOut, Plus, Trash2, Edit2, Save, X, ToggleLeft, ToggleRight, Percent, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const TABS = [
  { id: "servers", label: "Servers", icon: Server },
  { id: "discounts", label: "Discounts", icon: Percent },
  { id: "coupons", label: "Coupons", icon: Tag },
  { id: "payment", label: "Payment", icon: CreditCard },
] as const;

type TabId = typeof TABS[number]["id"];

interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  is_active: boolean;
  expires_at: string | null;
  usage_limit: number | null;
  used_count: number | null;
}

const Admin = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("servers");

  // Settings state
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [newCoupon, setNewCoupon] = useState({ code: "", discount_percent: 10, usage_limit: "", expires_at: "" });
  const [editingCoupon, setEditingCoupon] = useState<string | null>(null);
  const [siteDiscount, setSiteDiscount] = useState("20");

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
      if (map.site_discount_percent !== undefined) {
        setSiteDiscount(String(map.site_discount_percent));
      }
    }
  }, []);

  const loadCoupons = useCallback(async () => {
    try {
      const data = await adminCall("get_coupons");
      setCoupons(data.coupons || []);
    } catch (e) {
      console.error(e);
    }
  }, [adminCall]);

  useEffect(() => {
    if (isAuthenticated) {
      loadSettings();
      loadCoupons();
    }
  }, [isAuthenticated, loadSettings, loadCoupons]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await supabase.functions.invoke("admin-auth", {
        body: { action: "verify", password },
      });
      if (res.data?.success) {
        sessionStorage.setItem("admin_pwd", password);
        setIsAuthenticated(true);
        toast.success("Admin access granted!");
      } else {
        toast.error("Wrong password!");
      }
    } catch {
      toast.error("Authentication failed");
    }
    setIsLoading(false);
  };

  const toggleServer = async (key: string) => {
    const newValue = !settings[key];
    try {
      await adminCall("update_setting", { key, value: newValue });
      setSettings(prev => ({ ...prev, [key]: newValue }));
      toast.success("Server updated!");
    } catch {
      toast.error("Failed to update");
    }
  };

  const updateDiscount = async () => {
    try {
      await adminCall("update_setting", { key: "site_discount_percent", value: Number(siteDiscount) });
      setSettings(prev => ({ ...prev, site_discount_percent: Number(siteDiscount) }));
      toast.success("Discount updated!");
    } catch {
      toast.error("Failed to update");
    }
  };

  const createCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discount_percent) {
      toast.error("Code and discount required");
      return;
    }
    try {
      await adminCall("create_coupon", {
        code: newCoupon.code.toUpperCase(),
        discount_percent: newCoupon.discount_percent,
        usage_limit: newCoupon.usage_limit ? Number(newCoupon.usage_limit) : null,
        expires_at: newCoupon.expires_at || null,
      });
      setNewCoupon({ code: "", discount_percent: 10, usage_limit: "", expires_at: "" });
      loadCoupons();
      toast.success("Coupon created!");
    } catch (e: any) {
      toast.error(e.message || "Failed to create coupon");
    }
  };

  const toggleCoupon = async (coupon: Coupon) => {
    try {
      await adminCall("update_coupon", { id: coupon.id, is_active: !coupon.is_active });
      loadCoupons();
      toast.success("Coupon updated!");
    } catch {
      toast.error("Failed to update");
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await adminCall("delete_coupon", { id });
      loadCoupons();
      toast.success("Coupon deleted!");
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-3xl p-8 border border-border/50">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold gradient-text mb-2">ADMIN PANEL</h1>
              <p className="text-muted-foreground text-sm">Enter admin password to continue</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Admin Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="pl-10 bg-card border-border/50"
                />
              </div>
              <Button onClick={handleLogin} disabled={isLoading} className="w-full" variant="hero">
                {isLoading ? "Verifying..." : "Login"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              setPassword("");
            }}
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
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
            {/* Servers Tab */}
            {activeTab === "servers" && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold mb-6">Server Visibility</h2>
                {[
                  { key: "server_gem_enabled", name: "GEM SMP", color: "from-emerald-400 to-cyan-500" },
                  { key: "server_lifesteal_enabled", name: "LIFESTEAL", color: "from-red-500 to-rose-600" },
                  { key: "server_oneblock_enabled", name: "ONE BLOCK", color: "from-emerald-400 to-green-600" },
                ].map(server => (
                  <div key={server.key} className="glass rounded-2xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${settings[server.key] ? "bg-green-500" : "bg-red-500"}`} />
                      <span className={`font-display text-lg font-bold bg-gradient-to-r ${server.color} bg-clip-text text-transparent`}>
                        {server.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {settings[server.key] ? "Visible" : "Hidden"}
                      </span>
                      <Switch
                        checked={!!settings[server.key]}
                        onCheckedChange={() => toggleServer(server.key)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Discounts Tab */}
            {activeTab === "discounts" && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold mb-6">Site-Wide Discount</h2>
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-sm text-muted-foreground mb-2 block">Discount Percentage (%)</label>
                      <Input
                        type="number"
                        value={siteDiscount}
                        onChange={(e) => setSiteDiscount(e.target.value)}
                        className="bg-card border-border/50 max-w-[200px]"
                        min="0"
                        max="100"
                      />
                    </div>
                    <Button onClick={updateDiscount} variant="default" className="mt-6">
                      <Save className="w-4 h-4 mr-2" /> Save
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Currently: {settings.site_discount_percent || 0}% off on all products
                  </p>
                </div>
              </div>
            )}

            {/* Coupons Tab */}
            {activeTab === "coupons" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-bold">Coupon Codes</h2>
                  <Button variant="ghost" size="sm" onClick={loadCoupons}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                  </Button>
                </div>

                {/* Create new coupon */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-display text-sm font-bold mb-4 text-muted-foreground tracking-wider">CREATE NEW COUPON</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Code</label>
                      <Input
                        placeholder="SAVE20"
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon(p => ({ ...p, code: e.target.value }))}
                        className="bg-card border-border/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Discount %</label>
                      <Input
                        type="number"
                        value={newCoupon.discount_percent}
                        onChange={(e) => setNewCoupon(p => ({ ...p, discount_percent: Number(e.target.value) }))}
                        className="bg-card border-border/50"
                        min="1"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Usage Limit (optional)</label>
                      <Input
                        type="number"
                        placeholder="Unlimited"
                        value={newCoupon.usage_limit}
                        onChange={(e) => setNewCoupon(p => ({ ...p, usage_limit: e.target.value }))}
                        className="bg-card border-border/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Expires (optional)</label>
                      <Input
                        type="date"
                        value={newCoupon.expires_at}
                        onChange={(e) => setNewCoupon(p => ({ ...p, expires_at: e.target.value }))}
                        className="bg-card border-border/50"
                      />
                    </div>
                  </div>
                  <Button onClick={createCoupon} className="mt-4" variant="default">
                    <Plus className="w-4 h-4 mr-2" /> Create Coupon
                  </Button>
                </div>

                {/* Existing coupons */}
                <div className="space-y-3">
                  {coupons.map(coupon => (
                    <div key={coupon.id} className="glass rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-4">
                        <div className={`w-2.5 h-2.5 rounded-full ${coupon.is_active ? "bg-green-500" : "bg-red-500"}`} />
                        <div>
                          <span className="font-display font-bold text-lg">{coupon.code}</span>
                          <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                            <span>{coupon.discount_percent}% off</span>
                            <span>Used: {coupon.used_count || 0}{coupon.usage_limit ? `/${coupon.usage_limit}` : ""}</span>
                            {coupon.expires_at && <span>Expires: {new Date(coupon.expires_at).toLocaleDateString()}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={!!coupon.is_active}
                          onCheckedChange={() => toggleCoupon(coupon)}
                        />
                        <Button variant="ghost" size="icon" onClick={() => deleteCoupon(coupon.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {coupons.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No coupons yet</p>
                  )}
                </div>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold mb-6">Payment Settings</h2>
                <div className="glass rounded-2xl p-6">
                  <p className="text-muted-foreground text-sm mb-4">
                    Payment QR codes are managed through the product configuration. 
                    Contact the developer to update QR code images.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Current payment method: UPI QR Code
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
