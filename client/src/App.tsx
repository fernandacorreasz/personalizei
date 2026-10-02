/* Oficina Editorial: layout público do configurador, sem navegação concorrente com a bancada. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import { Route, Switch } from "wouter";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="bottom-right" />
          <Switch>
            <Route path="/camisa" component={Home} />
            <Route path="/" component={Landing} />
            <Route component={Landing} />
          </Switch>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
