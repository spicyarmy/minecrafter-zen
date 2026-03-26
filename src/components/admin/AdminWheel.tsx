import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Edit2, Save, X, RefreshCw, Copy, Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface WheelItem {
  id: string;
  name: string;
  description: string;
  value_label: string;
  weight: number;
  color: string;
  is_active: boolean;
}

interface WheelCode {
  id: string;
  code: string;
  is_used: boolean;
  used_by: string | null;
  won_item: string | null;
  created_at: string;
  used_at: string | null;
}

interface Props {
  adminCall: (action: string, data?: any) => Promise<any>;
}

const COLORS = [
  "#ff0066", "#ffaa00", "#00ccff", "#aa00ff", "#00ff88",
  "#ff4400", "#ff00aa", "#00aaff", "#ffcc00", "#ff6600",
];

const AdminWheel = ({ adminCall }: Props) => {
  const [items, setItems] = useState<WheelItem[]>([]);
  const [codes, setCodes] = useState<WheelCode[]>([]);
  const [tab, setTab] = useState<"items" | "codes">("items");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<WheelItem>>({});
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "", description: "", value_label: "", weight: 10, color: COLORS[0],
  });
  const [codeCount, setCodeCount] = useState(5);

  const loadItems = useCallback(async () => {
    try {
      const data = await adminCall("get_wheel_items");
      setItems(data.items || []);
    } catch (e) { console.error(e); }
  }, [adminCall]);

  const loadCodes = useCallback(async () => {
    try {
      const data = await adminCall("get_wheel_codes");
      setCodes(data.codes || []);
    } catch (e) { console.error(e); }
  }, [adminCall]);

  useEffect(() => {
    loadItems();
    loadCodes();
  }, [loadItems, loadCodes]);

  const createItem = async () => {
    if (!newItem.name) { toast.error("Name required"); return; }
    try {
      await adminCall("create_wheel_item", newItem);
      toast.success("Item added!");
      setNewItem({ name: "", description: "", value_label: "", weight: 10, color: COLORS[items.length % COLORS.length] });
      setShowAddItem(false);
      loadItems();
    } catch (e: any) { toast.error(e.message); }
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await adminCall("update_wheel_item", { id: editingId, ...editForm });
      toast.success("Updated!");
      setEditingId(null);
      loadItems();
    } catch (e: any) { toast.error(e.message); }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this wheel item?")) return;
    try {
      await adminCall("delete_wheel_item", { id });
      toast.success("Deleted!");
      loadItems();
    } catch (e: any) { toast.error(e.message); }
  };

  const toggleItem = async (item: WheelItem) => {
    try {
      await adminCall("update_wheel_item", { id: item.id, is_active: !item.is_active });
      toast.success(item.is_active ? "Hidden!" : "Visible!");
      loadItems();
    } catch { toast.error("Failed"); }
  };

  const generateCodes = async () => {
    try {
      await adminCall("generate_wheel_codes", { count: codeCount });
      toast.success(`${codeCount} codes generated!`);
      loadCodes();
    } catch (e: any) { toast.error(e.message); }
  };

  const deleteCode = async (id: string) => {
    try {
      await adminCall("delete_wheel_code", { id });
      toast.success("Code deleted!");
      loadCodes();
    } catch { toast.error("Failed"); }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  const unusedCodes = codes.filter(c => !c.is_used);
  const usedCodes = codes.filter(c => c.is_used);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display text-xl font-bold">🎡 Lucky Wheel</h2>
        <div className="flex gap-2">
          {(["items", "codes"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl font-display text-sm tracking-wider transition-all ${
                tab === t ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "items" ? "Wheel Items" : `Codes (${unusedCodes.length})`}
            </button>
          ))}
        </div>
      </div>

      {tab === "items" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={loadItems}>
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
            <Button variant="default" size="sm" onClick={() => setShowAddItem(!showAddItem)}>
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
          </div>

          {showAddItem && (
            <div className="glass rounded-2xl p-6 border border-primary/30">
              <h3 className="font-display text-sm font-bold mb-4 text-muted-foreground tracking-wider">ADD WHEEL ITEM</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Name *</label>
                  <Input value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} className="bg-card border-border/50" placeholder="Diamond Sword" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Value Label</label>
                  <Input value={newItem.value_label} onChange={e => setNewItem(p => ({ ...p, value_label: e.target.value }))} className="bg-card border-border/50" placeholder="Worth ₹100" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Weight (rarity, low=rare)</label>
                  <Input type="number" value={newItem.weight} onChange={e => setNewItem(p => ({ ...p, weight: Number(e.target.value) }))} className="bg-card border-border/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Color</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={newItem.color} onChange={e => setNewItem(p => ({ ...p, color: e.target.value }))} className="w-10 h-10 rounded cursor-pointer" />
                    <Input value={newItem.color} onChange={e => setNewItem(p => ({ ...p, color: e.target.value }))} className="bg-card border-border/50" />
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                  <Input value={newItem.description} onChange={e => setNewItem(p => ({ ...p, description: e.target.value }))} className="bg-card border-border/50" placeholder="Extra details..." />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={createItem}><Plus className="w-4 h-4 mr-2" /> Create</Button>
                <Button variant="ghost" onClick={() => setShowAddItem(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={item.id} className="glass rounded-xl p-4">
                {editingId === item.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input value={editForm.name || ""} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} className="bg-card border-border/50" placeholder="Name" />
                      <Input value={editForm.value_label || ""} onChange={e => setEditForm(p => ({ ...p, value_label: e.target.value }))} className="bg-card border-border/50" placeholder="Value label" />
                      <Input type="number" value={editForm.weight || 10} onChange={e => setEditForm(p => ({ ...p, weight: Number(e.target.value) }))} className="bg-card border-border/50" placeholder="Weight" />
                    </div>
                    <div className="flex gap-2">
                      <input type="color" value={editForm.color || "#ff0066"} onChange={e => setEditForm(p => ({ ...p, color: e.target.value }))} className="w-10 h-10 rounded cursor-pointer" />
                      <Input value={editForm.description || ""} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} className="bg-card border-border/50 flex-1" placeholder="Description" />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEdit}><Save className="w-4 h-4 mr-1" /> Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 border-border/50" style={{ backgroundColor: item.color }} />
                      <div>
                        <span className="font-display font-bold">{item.name}</span>
                        {item.value_label && <span className="text-xs text-muted-foreground ml-2">{item.value_label}</span>}
                        <div className="text-xs text-muted-foreground">
                          Weight: {item.weight} (higher = more common)
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={item.is_active} onCheckedChange={() => toggleItem(item)} />
                      <Button variant="ghost" size="icon" onClick={() => { setEditingId(item.id); setEditForm({ ...item }); }}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Dices className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No wheel items yet. Add some!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "codes" && (
        <div className="space-y-4">
          <div className="flex gap-3 items-end flex-wrap">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Generate codes</label>
              <div className="flex gap-2">
                <Input type="number" value={codeCount} onChange={e => setCodeCount(Number(e.target.value))} className="bg-card border-border/50 w-20" min={1} max={50} />
                <Button onClick={generateCodes}><Plus className="w-4 h-4 mr-2" /> Generate</Button>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={loadCodes}>
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          </div>

          {/* Unused codes */}
          <div>
            <h3 className="font-display text-sm font-bold text-muted-foreground tracking-wider mb-3">
              UNUSED CODES ({unusedCodes.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {unusedCodes.map(c => (
                <div key={c.id} className="glass rounded-lg p-3 flex items-center justify-between">
                  <code className="font-mono text-sm text-foreground">{c.code}</code>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyCode(c.code)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteCode(c.id)}>
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {unusedCodes.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No unused codes</p>}
            </div>
          </div>

          {/* Used codes */}
          {usedCodes.length > 0 && (
            <div>
              <h3 className="font-display text-sm font-bold text-muted-foreground tracking-wider mb-3">
                USED CODES ({usedCodes.length})
              </h3>
              <div className="space-y-2">
                {usedCodes.map(c => (
                  <div key={c.id} className="glass rounded-lg p-3 flex items-center justify-between opacity-60">
                    <div>
                      <code className="font-mono text-sm line-through">{c.code}</code>
                      <span className="text-xs text-muted-foreground ml-3">Used by: {c.used_by || "?"} → Won: {c.won_item || "?"}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteCode(c.id)}>
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminWheel;
