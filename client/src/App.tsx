/* Oficina Editorial: layout público do configurador, sem navegação concorrente com a bancada. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import PhotoBoothPage from "./features/cabine/PhotoBoothPage";
import CamisetaPage from "./features/camisa/CamisetaPage";
import Landing from "./pages/Landing";
import { Route, Switch } from "wouter";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="bottom-right" />
          <Switch>
            <Route path="/camisa" component={CamisetaPage} />
            <Route path="/cabine" component={PhotoBoothPage} />
            <Route path="/" component={Landing} />
            <Route component={Landing} />
          </Switch>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
