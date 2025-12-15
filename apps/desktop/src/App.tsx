import { Shell } from "./components/Shell";
import { DaemonProvider } from "./hooks/useDaemonConnection";
import { WorkspaceProvider } from "./hooks/useWorkspace";

function App() {
  return (
    <DaemonProvider>
      <WorkspaceProvider>
        <Shell />
      </WorkspaceProvider>
    </DaemonProvider>
  );
}

export default App;
