import { useState, useEffect, useCallback } from "react";
import { Send, RefreshCw, Check, X, Clock, AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PendingCommand {
  id: string;
  player_name: string;
  command: string;
  server: string;
  status: string;
  product_info: string;
  created_at: string;
  executed_at: string | null;
}

interface Product {
  id: string;
  name: string;
  product_key: string;
  server: string;
  command_template: string;
  category: string;
}

interface AdminDeliveryProps {
  adminCall: (action: string, data?: any) => Promise<any>;
}

const AdminDelivery = ({ adminCall }: AdminDeliveryProps) => {
  const [commands, setCommands] = useState<PendingCommand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [customCommand, setCustomCommand] = useState("");
  const [selectedServer, setSelectedServer] = useState("gem");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  const loadCommands = useCallback(async () => {
    try {
      const data = await adminCall("get_pending_commands");
      setCommands(data.commands || []);
    } catch (e: any) {
      console.error(e);
    }
  }, [adminCall]);

  const loadProducts = useCallback(async () => {
    try {
      const data = await adminCall("get_products");
      setProducts((data.products || []).filter((p: Product) => p.command_template));
    } catch (e: any) {
      console.error(e);
    }
  }, [adminCall]);

  useEffect(() => {
    loadCommands();
    loadProducts();
  }, [loadCommands, loadProducts]);

  const generateCommand = (template: string, player: string): string => {
    return template.replace(/\{player\}/g, player);
  };

  const handleDeliver = async () => {
    if (!playerName.trim()) {
      toast.error("Player name is required!");
      return;
    }

    let finalCommand = customCommand.trim();
    let productInfo = "Custom command";

    if (selectedProductId && !finalCommand) {
      const product = products.find(p => p.id === selectedProductId);
      if (!product) {
        toast.error("Product not found");
        return;
      }
      if (!product.command_template) {
        toast.error("This product has no command template set!");
        return;
      }
      finalCommand = generateCommand(product.command_template, playerName.trim());
      productInfo = product.name;
    }

    if (!finalCommand) {
      toast.error("Select a product or enter a custom command!");
      return;
    }

    setLoading(true);
    try {
      await adminCall("create_pending_command", {
        player_name: playerName.trim(),
        command: finalCommand,
        server: selectedServer,
        product_info: productInfo,
      });
      toast.success(`Command queued for ${playerName}!`);
      setPlayerName("");
      setCustomCommand("");
      setSelectedProductId("");
      loadCommands();
    } catch (e: any) {
      toast.error(e.message || "Failed to queue command");
    } finally {
      setLoading(false);
    }
  };

  const deleteCommand = async (id: string) => {
    try {
      await adminCall("delete_pending_command", { id });
      toast.success("Command deleted!");
      loadCommands();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "executed": return <Check className="w-4 h-4 text-green-500" />;
      case "failed": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
    }
  };

  const filteredCommands = commands.filter(c => {
    if (filterStatus === "all") return true;
    return c.status === filterStatus;
  });

  const serverProducts = products.filter(p => p.server === selectedServer);

  return (
    <div className="space-y-6">
      {/* Deliver Form */}
      <div className="glass rounded-2xl p-6 border border-primary/30">
        <h3 className="font-display text-sm font-bold mb-4 text-muted-foreground tracking-wider">
          🎮 DELIVER TO PLAYER
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Player Name (Minecraft)</label>
            <Input
              placeholder="Steve123"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              className="bg-card border-border/50"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Server</label>
            <select
              value={selectedServer}
              onChange={e => setSelectedServer(e.target.value)}
              className="w-full h-10 rounded-md bg-card border border-border/50 px-3 text-sm"
            >
              <option value="gem">Gem SMP</option>
              <option value="lifesteal">Lifesteal</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Select Product</label>
            <select
              value={selectedProductId}
              onChange={e => {
                setSelectedProductId(e.target.value);
                if (e.target.value) setCustomCommand("");
              }}
              className="w-full h-10 rounded-md bg-card border border-border/50 px-3 text-sm"
            >
              <option value="">-- Select product --</option>
              {serverProducts.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Or Custom Command</label>
            <Input
              placeholder="lp user Steve123 parent set vip"
              value={customCommand}
              onChange={e => {
                setCustomCommand(e.target.value);
                if (e.target.value) setSelectedProductId("");
              }}
              className="bg-card border-border/50"
            />
          </div>
        </div>

        {/* Preview */}
        {playerName && (selectedProductId || customCommand) && (
          <div className="mt-4 p-3 rounded-lg bg-card/50 border border-border/30">
            <p className="text-xs text-muted-foreground mb-1">Command Preview:</p>
            <code className="text-sm text-primary font-mono">
              {customCommand || (selectedProductId
                ? generateCommand(
                    products.find(p => p.id === selectedProductId)?.command_template || "",
                    playerName
                  )
                : "")}
            </code>
          </div>
        )}

        <Button onClick={handleDeliver} disabled={loading} className="mt-4">
          <Send className="w-4 h-4 mr-2" />
          {loading ? "Sending..." : "Queue Command"}
        </Button>
      </div>

      {/* Command History */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display text-xl font-bold">Delivery Queue</h2>
        <div className="flex gap-2">
          {["all", "pending", "executed", "failed"].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg font-display text-xs tracking-wider transition-all ${
                filterStatus === s
                  ? "bg-primary text-primary-foreground"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
          <Button variant="ghost" size="sm" onClick={loadCommands}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {filteredCommands.map(cmd => (
          <div key={cmd.id} className="glass rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              {statusIcon(cmd.status)}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold">{cmd.player_name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-display">
                    {cmd.server.toUpperCase()}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-display ${
                    cmd.status === "executed" ? "bg-green-500/20 text-green-400" :
                    cmd.status === "failed" ? "bg-red-500/20 text-red-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {cmd.status.toUpperCase()}
                  </span>
                </div>
                <code className="text-xs text-muted-foreground font-mono mt-1 block">{cmd.command}</code>
                <div className="text-xs text-muted-foreground mt-1">
                  {cmd.product_info && <span className="mr-3">📦 {cmd.product_info}</span>}
                  <span>{new Date(cmd.created_at).toLocaleString()}</span>
                  {cmd.executed_at && <span className="ml-3">✅ {new Date(cmd.executed_at).toLocaleString()}</span>}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => deleteCommand(cmd.id)}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
        {filteredCommands.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Send className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No commands in queue</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDelivery;
