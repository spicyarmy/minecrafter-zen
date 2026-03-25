import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  is_active: boolean;
  expires_at: string | null;
  usage_limit: number | null;
  used_count: number | null;
}

interface AdminCouponsProps {
  adminCall: (action: string, data?: any) => Promise<any>;
}

const AdminCoupons = ({ adminCall }: AdminCouponsProps) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [newCoupon, setNewCoupon] = useState({ code: "", discount_percent: 10, usage_limit: "", expires_at: "" });

  const loadCoupons = useCallback(async () => {
    try {
      const data = await adminCall("get_coupons");
      setCoupons(data.coupons || []);
    } catch (e) {
      console.error(e);
    }
  }, [adminCall]);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">Coupon Codes</h2>
        <Button variant="ghost" size="sm" onClick={loadCoupons}>
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

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
  );
};

export default AdminCoupons;
