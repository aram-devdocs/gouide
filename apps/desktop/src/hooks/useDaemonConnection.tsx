import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { GouideClient, type ConnectionState, type DaemonInfo } from "@gouide/core-client";
import { TauriTransport } from "@gouide/core-client/tauri";

interface DaemonContextValue {
  /** Current connection state */
  state: ConnectionState;
  /** Discovered daemon info (if any) */
  daemonInfo: DaemonInfo | null;
  /** Connect to the daemon */
  connect: () => Promise<void>;
  /** Disconnect from the daemon */
  disconnect: () => Promise<void>;
  /** Retry discovery */
  retry: () => Promise<void>;
}

const DaemonContext = createContext<DaemonContextValue | null>(null);

// Create a single client instance
const transport = new TauriTransport();
const client = new GouideClient({
  transport,
  clientName: "Gouide Desktop",
});

export function DaemonProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConnectionState>({ status: "disconnected" });
  const [daemonInfo, setDaemonInfo] = useState<DaemonInfo | null>(null);

  // Subscribe to client events
  useEffect(() => {
    const unsubscribe = client.subscribe((event) => {
      switch (event.type) {
        case "connecting":
          setState({ status: "connecting" });
          break;
        case "connected":
          setState({ status: "connected", welcome: event.welcome });
          break;
        case "disconnected":
          setState({ status: "disconnected" });
          break;
        case "error":
          setState({ status: "error", error: event.error });
          break;
      }
    });

    return unsubscribe;
  }, []);

  // Discover and connect on mount
  useEffect(() => {
    discoverAndConnect();
  }, []);

  const discoverAndConnect = async () => {
    try {
      setState({ status: "connecting" });

      // Use ensureAndConnect which will spawn daemon if not running
      const welcome = await transport.ensureAndConnect(
        client.clientId,
        client.clientName
      );

      // Update state with the welcome info
      setState({ status: "connected", welcome });

      // Discover daemon info for display
      const info = await transport.discover();
      setDaemonInfo(info);
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      setState({ status: "error", error });
    }
  };

  const connect = useCallback(async () => {
    if (state.status === "connected") return;
    await client.connect();
  }, [state.status]);

  const disconnect = useCallback(async () => {
    await client.disconnect();
  }, []);

  const retry = useCallback(async () => {
    setState({ status: "disconnected" });
    setDaemonInfo(null);
    await discoverAndConnect();
  }, []);

  return (
    <DaemonContext.Provider
      value={{ state, daemonInfo, connect, disconnect, retry }}
    >
      {children}
    </DaemonContext.Provider>
  );
}

export function useDaemonConnection(): DaemonContextValue {
  const context = useContext(DaemonContext);
  if (!context) {
    throw new Error("useDaemonConnection must be used within a DaemonProvider");
  }
  return context;
}
