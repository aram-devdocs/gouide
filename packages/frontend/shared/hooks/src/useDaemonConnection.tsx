import { type ConnectionState, type DaemonInfo, GouideClient } from "@gouide/core-client";
import { TauriTransport } from "@gouide/core-client/tauri";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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
  const connectingRef = useRef(false);

  // Subscribe to client events
  useEffect(() => {
    const unsubscribe = client.subscribe((event) => {
      switch (event.type) {
        case "connecting":
          setState({ status: "connecting" });
          break;
        case "connected":
          setState({ status: "connected", welcome: event.welcome });
          connectingRef.current = false;
          break;
        case "disconnected":
          setState({ status: "disconnected" });
          connectingRef.current = false;
          break;
        case "error":
          setState({ status: "error", error: event.error });
          connectingRef.current = false;
          break;
      }
    });

    return unsubscribe;
  }, []);

  // Discover and connect on mount
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // Prevent multiple simultaneous connections (React StrictMode causes double mount)
      if (connectingRef.current) {
        return;
      }
      connectingRef.current = true;

      try {
        // Use client.ensureAndConnect which properly updates state
        await client.ensureAndConnect();

        if (!mounted) return;

        // Discover daemon info for display
        const info = await transport.discover();
        if (mounted) {
          setDaemonInfo(info);
        }
      } catch (_e) {
        // Error is already handled by client state management
        if (!mounted) return;
      } finally {
        connectingRef.current = false;
      }
    };

    init();

    return () => {
      mounted = false;
      // Don't disconnect on unmount - the daemon should stay alive
      // This cleanup just prevents state updates after unmount
    };
  }, []);

  const discoverAndConnect = useCallback(async () => {
    if (connectingRef.current) {
      return;
    }
    connectingRef.current = true;

    try {
      // Use client.ensureAndConnect which properly updates state
      await client.ensureAndConnect();

      // Discover daemon info for display
      const info = await transport.discover();
      setDaemonInfo(info);
    } catch (_e) {
      // Error is already handled by client state management
    } finally {
      connectingRef.current = false;
    }
  }, []);

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
    connectingRef.current = false; // Reset the flag
    await discoverAndConnect();
  }, [discoverAndConnect]);

  return (
    <DaemonContext.Provider value={{ state, daemonInfo, connect, disconnect, retry }}>
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
