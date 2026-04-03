import { useState, useEffect, useCallback } from "react";
import { Send, RefreshCw, Check, X, Clock, AlertTriangle, Trash2, CheckCircle, Eye } from "lucide-react";
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

interface AdminDeliveryProps {
  adminCall: (action: string, data?: any) => Promise<any>;
}

const AdminDelivery = ({ adminCall }: AdminDeliveryProps) => {
  const [commands, setCommands] = useState<PendingCommand[]>([]);
  const [filterStatus, setFilterStatus] = useState("review");
  const [loading, setLoading] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const loadCommands = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminCall("get_pending_commands");
      setCommands(data.commands || []);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [adminCall]);

  useEffect(() => {
    loadCommands();
  }, [loadCommands]);

  const confirmOrder = async (cmd: PendingCommand) => {
    setConfirmingId(cmd.id);
    try {
      await adminCall("update_pending_command_status", { id: cmd.id, status: "pending" });
      toast.success(`✅ Order confirmed for ${cmd.player_name}! Command queued for execution.`);
      loadCommands();
    } catch (e: any) {
      toast.error(e.message || "Failed to confirm");
    } finally {
      setConfirmingId(null);
    }
  };

  const rejectOrder = async (id: string) => {
    try {
      await adminCall("update_pending_command_status", { id, status: "rejected" });
      toast.success("Order rejected");
      loadCommands();
    } catch {
      toast.error("Failed to reject");
    }
  };

  const deleteCommand = async (id: string) => {
    try {
      await adminCall("delete_pending_command", { id });
      toast.success("Deleted!");
      loadCommands();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "executed": return <Check className="w-4 h-4 text-green-500" />;
      case "failed": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "rejected": return <X className="w-4 h-4 text-red-500" />;
      case "review": return <Eye className="w-4 h-4 text-blue-400 animate-pulse" />;
      case "pending": return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "executed": return "bg-green-500/20 text-green-400";
      case "failed": return "bg-red-500/20 text-red-400";
      case "rejected": return "bg-red-500/20 text-red-400";
      case "review": return "bg-blue-500/20 text-blue-400";
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredCommands = commands.filter(c => {
    if (filterStatus === "all") return true;
    return c.status === filterStatus;
  });

  const reviewCount = commands.filter(c => c.status === "review").length;
  const pendingCount = commands.filter(c => c.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4 border border-blue-500/30">
          <p className="text-xs text-muted-foreground font-display tracking-wider">PURCHASE QUERIES</p>
          <p className="text-2xl font-display font-black text-blue-400">{reviewCount}</p>
        </div>
        <div className="glass rounded-xl p-4 border border-yellow-500/30">
          <p className="text-xs text-muted-foreground font-display tracking-wider">QUEUED</p>
          <p className="text-2xl font-display font-black text-yellow-400">{pendingCount}</p>
        </div>
        <div className="glass rounded-xl p-4 border border-green-500/30">
          <p className="text-xs text-muted-foreground font-display tracking-wider">EXECUTED</p>
          <p className="text-2xl font-display font-black text-green-400">
            {commands.filter(c => c.status === "executed").length}
          </p>
        </div>
        <div className="glass rounded-xl p-4 border border-red-500/30">
          <p className="text-xs text-muted-foreground font-display tracking-wider">FAILED/REJECTED</p>
          <p className="text-2xl font-display font-black text-red-400">
            {commands.filter(c => c.status === "failed" || c.status === "rejected").length}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display text-xl font-bold">
          {filterStatus === "review" ? "🛒 Purchase Queries" : 
           filterStatus === "pending" ? "⏳ Queued Commands" :
           filterStatus === "executed" ? "✅ Executed" :
           "📋 All Orders"}
        </h2>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "review", label: `QUERIES${reviewCount > 0 ? ` (${reviewCount})` : ""}` },
            { key: "pending", label: `QUEUED${pendingCount > 0 ? ` (${pendingCount})` : ""}` },
            { key: "executed", label: "EXECUTED" },
            { key: "all", label: "ALL" },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setFilterStatus(s.key)}
              className={`px-3 py-1.5 rounded-lg font-display text-xs tracking-wider transition-all ${
                filterStatus === s.key
                  ? "bg-primary text-primary-foreground"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
          <Button variant="ghost" size="sm" onClick={loadCommands} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredCommands.map(cmd => (
          <div
            key={cmd.id}
            className={`glass rounded-xl p-5 border transition-all ${
              cmd.status === "review" ? "border-blue-500/40 shadow-[0_0_15px_hsla(220,80%,50%,0.15)]" : "border-border/30"
            }`}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                {/* Player + Status */}
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {statusIcon(cmd.status)}
                  <span className="font-display font-bold text-lg">{cmd.player_name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-display">
                    {cmd.server.toUpperCase()}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-display ${statusColor(cmd.status)}`}>
                    {cmd.status.toUpperCase()}
                  </span>
                </div>

                {/* Product Info */}
                {cmd.product_info && (
                  <div className="text-sm text-foreground mb-2">
                    📦 {cmd.product_info}
                  </div>
                )}

                {/* Command */}
                {cmd.command && (
                  <div className="p-2 rounded-lg bg-card/50 border border-border/30 mb-2">
                    <p className="text-xs text-muted-foreground mb-1">Command:</p>
                    <code className="text-xs text-primary font-mono break-all">{cmd.command}</code>
                  </div>
                )}

                {/* Timestamps */}
                <div className="text-xs text-muted-foreground flex gap-4 flex-wrap">
                  <span>🕐 {new Date(cmd.created_at).toLocaleString()}</span>
                  {cmd.executed_at && <span>✅ {new Date(cmd.executed_at).toLocaleString()}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                {cmd.status === "review" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => confirmOrder(cmd)}
                      disabled={confirmingId === cmd.id}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {confirmingId === cmd.id ? "..." : "Confirm"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => rejectOrder(cmd.id)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="icon" onClick={() => deleteCommand(cmd.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredCommands.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Send className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="font-display">
              {filterStatus === "review" ? "No purchase queries yet" :
               filterStatus === "pending" ? "No commands queued" :
               "No orders found"}
            </p>
            <p className="text-xs mt-1">
              {filterStatus === "review" && "When someone buys from the store, their order will appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDelivery;
