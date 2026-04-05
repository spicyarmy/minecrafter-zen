import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Edit2, Save, X, RefreshCw, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  product_key: string;
  category: string;
  server: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  is_active: boolean;
  sort_order: number;
  command_template: string;
  metadata: Record<string, any>;
}

interface AdminProductsProps {
  adminCall: (action: string, data?: any) => Promise<any>;
}

const PerksEditor = ({ perks, onChange }: { perks: string[]; onChange: (perks: string[]) => void }) => {
  const [newPerk, setNewPerk] = useState("");

  const addPerk = () => {
    const trimmed = newPerk.trim();
    if (!trimmed) return;
    if (!perks.includes(trimmed)) {
      onChange([...perks, trimmed]);
    }
    setNewPerk("");
  };

  const removePerk = (index: number) => {
    onChange(perks.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">Perks / Bonuses</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {perks.map((perk, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/20 text-primary text-xs font-display">
            {perk}
            <button onClick={() => removePerk(i)} className="hover:text-destructive">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {perks.length === 0 && <span className="text-xs text-muted-foreground/50">No perks added</span>}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add perk e.g. /pv"
          value={newPerk}
          onChange={(e) => setNewPerk(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPerk())}
          className="bg-card border-border/50 text-xs h-8"
        />
        <Button type="button" size="sm" variant="outline" onClick={addPerk} className="h-8 px-3">
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

const AdminProducts = ({ adminCall }: AdminProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterServer, setFilterServer] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [newProduct, setNewProduct] = useState({
    product_key: "",
    category: "rank",
    server: "gem",
    name: "",
    description: "",
    price: 0,
    original_price: 0,
    sort_order: 0,
    metadata: { perks: [] as string[] },
  });

  const loadProducts = useCallback(async () => {
    try {
      const data = await adminCall("get_products");
      setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    }
  }, [adminCall]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({ ...product, metadata: product.metadata || { perks: [] } });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await adminCall("update_product", {
        id: editingId,
        name: editForm.name,
        description: editForm.description,
        price: editForm.price,
        original_price: editForm.original_price,
        category: editForm.category,
        server: editForm.server,
        sort_order: editForm.sort_order,
        command_template: editForm.command_template,
        metadata: editForm.metadata,
      });
      toast.success("Product updated!");
      cancelEdit();
      loadProducts();
    } catch (e: any) {
      toast.error(e.message || "Failed to update");
    }
  };

  const toggleProduct = async (product: Product) => {
    try {
      await adminCall("update_product", { id: product.id, is_active: !product.is_active });
      toast.success(product.is_active ? "Product hidden!" : "Product visible!");
      loadProducts();
    } catch {
      toast.error("Failed to update");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await adminCall("delete_product", { id });
      toast.success("Product deleted!");
      loadProducts();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const createProduct = async () => {
    if (!newProduct.name || !newProduct.product_key) {
      toast.error("Name and key are required");
      return;
    }
    try {
      await adminCall("create_product", newProduct);
      toast.success("Product created!");
      setNewProduct({ product_key: "", category: "rank", server: "gem", name: "", description: "", price: 0, original_price: 0, sort_order: 0, metadata: { perks: [] } });
      setShowAddForm(false);
      loadProducts();
    } catch (e: any) {
      toast.error(e.message || "Failed to create product");
    }
  };

  const servers = ["all", ...new Set(products.map(p => p.server))];
  const categories = ["all", ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    if (filterServer !== "all" && p.server !== filterServer) return false;
    if (filterCategory !== "all" && p.category !== filterCategory) return false;
    return true;
  });

  const getPerks = (product: Product): string[] => {
    return (product.metadata as any)?.perks || [];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display text-xl font-bold">Store Products</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={loadProducts}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button variant="default" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex gap-1">
          {servers.map(s => (
            <button
              key={s}
              onClick={() => setFilterServer(s)}
              className={`px-3 py-1.5 rounded-lg font-display text-xs tracking-wider transition-all ${
                filterServer === s
                  ? "bg-primary text-primary-foreground"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "all" ? "All Servers" : s.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className={`px-3 py-1.5 rounded-lg font-display text-xs tracking-wider transition-all ${
                filterCategory === c
                  ? "bg-primary text-primary-foreground"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {c === "all" ? "All Types" : c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="glass rounded-2xl p-6 border border-primary/30">
          <h3 className="font-display text-sm font-bold mb-4 text-muted-foreground tracking-wider">ADD NEW PRODUCT</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Product Key (unique)</label>
              <Input
                placeholder="my-rank"
                value={newProduct.product_key}
                onChange={(e) => setNewProduct(p => ({ ...p, product_key: e.target.value }))}
                className="bg-card border-border/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Name</label>
              <Input
                placeholder="MY RANK"
                value={newProduct.name}
                onChange={(e) => setNewProduct(p => ({ ...p, name: e.target.value }))}
                className="bg-card border-border/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Server</label>
              <select
                value={newProduct.server}
                onChange={(e) => setNewProduct(p => ({ ...p, server: e.target.value }))}
                className="w-full h-10 rounded-md bg-card border border-border/50 px-3 text-sm"
              >
                <option value="gem">Gem SMP</option>
                <option value="lifesteal">Lifesteal</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Category</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct(p => ({ ...p, category: e.target.value }))}
                className="w-full h-10 rounded-md bg-card border border-border/50 px-3 text-sm"
              >
                <option value="rank">Rank</option>
                <option value="key">Key</option>
                <option value="currency">Currency</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Sale Price (₹)</label>
              <Input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct(p => ({ ...p, price: Number(e.target.value) }))}
                className="bg-card border-border/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Original Price (₹)</label>
              <Input
                type="number"
                value={newProduct.original_price}
                onChange={(e) => setNewProduct(p => ({ ...p, original_price: Number(e.target.value) }))}
                className="bg-card border-border/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Sort Order</label>
              <Input
                type="number"
                value={newProduct.sort_order}
                onChange={(e) => setNewProduct(p => ({ ...p, sort_order: Number(e.target.value) }))}
                className="bg-card border-border/50"
              />
            </div>
            <div className="lg:col-span-4">
              <label className="text-xs text-muted-foreground mb-1 block">Description</label>
              <Input
                placeholder="Product description..."
                value={newProduct.description}
                onChange={(e) => setNewProduct(p => ({ ...p, description: e.target.value }))}
                className="bg-card border-border/50"
              />
            </div>
            <div className="lg:col-span-4">
              <PerksEditor
                perks={newProduct.metadata.perks}
                onChange={(perks) => setNewProduct(p => ({ ...p, metadata: { ...p.metadata, perks } }))}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={createProduct} variant="default">
              <Plus className="w-4 h-4 mr-2" /> Create
            </Button>
            <Button onClick={() => setShowAddForm(false)} variant="ghost">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="space-y-3">
        {filteredProducts.map(product => (
          <div key={product.id} className="glass rounded-xl p-4">
            {editingId === product.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                    <Input
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))}
                      className="bg-card border-border/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Sale Price (₹)</label>
                    <Input
                      type="number"
                      value={editForm.price || 0}
                      onChange={(e) => setEditForm(p => ({ ...p, price: Number(e.target.value) }))}
                      className="bg-card border-border/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Original Price (₹)</label>
                    <Input
                      type="number"
                      value={editForm.original_price || 0}
                      onChange={(e) => setEditForm(p => ({ ...p, original_price: Number(e.target.value) }))}
                      className="bg-card border-border/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Server</label>
                    <select
                      value={editForm.server || "gem"}
                      onChange={(e) => setEditForm(p => ({ ...p, server: e.target.value }))}
                      className="w-full h-10 rounded-md bg-card border border-border/50 px-3 text-sm"
                    >
                      <option value="gem">Gem SMP</option>
                      <option value="lifesteal">Lifesteal</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                    <select
                      value={editForm.category || "rank"}
                      onChange={(e) => setEditForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full h-10 rounded-md bg-card border border-border/50 px-3 text-sm"
                    >
                      <option value="rank">Rank</option>
                      <option value="key">Key</option>
                      <option value="currency">Currency</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                  <Input
                    value={editForm.description || ""}
                    onChange={(e) => setEditForm(p => ({ ...p, description: e.target.value }))}
                    className="bg-card border-border/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Command Template</label>
                  <Input
                    placeholder="lp user {player} parent set vip"
                    value={editForm.command_template || ""}
                    onChange={(e) => setEditForm(p => ({ ...p, command_template: e.target.value }))}
                    className="bg-card border-border/50 font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Use {"{player}"} for player name</p>
                </div>
                <PerksEditor
                  perks={(editForm.metadata as any)?.perks || []}
                  onChange={(perks) => setEditForm(p => ({ ...p, metadata: { ...(p.metadata || {}), perks } }))}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit}>
                    <Save className="w-4 h-4 mr-1" /> Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEdit}>
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${product.is_active ? "bg-green-500" : "bg-red-500"}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-lg">{product.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-display">
                        {product.server.toUpperCase()}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/20 text-secondary font-display">
                        {product.category.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                      <span>
                        <span className="line-through mr-1">₹{product.original_price}</span>
                        <span className="text-foreground font-bold">₹{product.price}</span>
                      </span>
                      <span>Key: {product.product_key}</span>
                      <span>Order: {product.sort_order}</span>
                    </div>
                    {getPerks(product).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {getPerks(product).map((perk, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-accent/30 text-accent-foreground font-display">
                            {perk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={product.is_active}
                    onCheckedChange={() => toggleProduct(product)}
                  />
                  <Button variant="ghost" size="icon" onClick={() => startEdit(product)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteProduct(product.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;