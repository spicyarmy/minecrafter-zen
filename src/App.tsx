import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ServerSelect from "./pages/ServerSelect";
import Index from "./pages/Index";
import LifestealStore from "./pages/LifestealStore";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import LuckyWheel from "./pages/LuckyWheel";
import CustomWeapon from "./pages/CustomWeapon";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ServerSelect />} />
          <Route path="/gem" element={<Index />} />
          <Route path="/lifesteal" element={<LifestealStore />} />
          <Route path="/checkout/:productId" element={<Checkout />} />
          <Route path="/lucky-wheel" element={<LuckyWheel />} />
          <Route path="/custom-weapon" element={<CustomWeapon />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
