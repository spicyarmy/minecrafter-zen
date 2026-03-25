import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AdminDiscountsProps {
  settings: Record<string, any>;
  setSettings: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  adminCall: (action: string, data?: any) => Promise<any>;
}

const AdminDiscounts = ({ settings, setSettings, adminCall }: AdminDiscountsProps) => {
  const [siteDiscount, setSiteDiscount] = useState(String(settings.site_discount_percent || 0));

  const updateDiscount = async () => {
    try {
      await adminCall("update_setting", { key: "site_discount_percent", value: Number(siteDiscount) });
      setSettings(prev => ({ ...prev, site_discount_percent: Number(siteDiscount) }));
      toast.success("Discount updated!");
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
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
  );
};

export default AdminDiscounts;
