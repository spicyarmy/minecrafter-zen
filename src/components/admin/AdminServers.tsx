import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface AdminServersProps {
  settings: Record<string, any>;
  setSettings: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  adminCall: (action: string, data?: any) => Promise<any>;
}

const AdminServers = ({ settings, setSettings, adminCall }: AdminServersProps) => {
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

  const servers = [
    { key: "server_gem_enabled", name: "GEM SMP", color: "from-emerald-400 to-cyan-500" },
    { key: "server_lifesteal_enabled", name: "LIFESTEAL", color: "from-red-500 to-rose-600" },
    { key: "server_oneblock_enabled", name: "ONE BLOCK", color: "from-emerald-400 to-green-600" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold mb-6">Server Visibility</h2>
      {servers.map(server => (
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
  );
};

export default AdminServers;
