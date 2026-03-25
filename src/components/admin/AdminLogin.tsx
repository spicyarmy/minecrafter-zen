import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await supabase.functions.invoke("admin-auth", {
        body: { action: "verify", password },
      });
      if (res.data?.success) {
        sessionStorage.setItem("admin_pwd", password);
        onLogin();
        toast.success("Admin access granted!");
      } else {
        toast.error("Wrong password!");
      }
    } catch {
      toast.error("Authentication failed");
    }
    setIsLoading(false);
  };

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
};

export default AdminLogin;
