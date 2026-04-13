import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { MetaProvider } from "@solidjs/meta";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { AuthProvider } from "~/lib/guards/auth";
import { StoreProvider } from "~/lib/store-context";
import "./app.css";
import Home from "./home"
// Shared QueryClient instance - required so all components share the same cache.
// Without this, invalidating/refetching queries from one component won't affect others.
const queryClient = new QueryClient()

export default function App() {

  return (
    <MetaProvider>
      <QueryClientProvider client={queryClient}>
        <StoreProvider id="st_1abc00000400">
          <Router
            root={Home}
          >
            <FileRoutes />
          </Router>
        </StoreProvider>
      </QueryClientProvider>
    </MetaProvider>
  );
}
