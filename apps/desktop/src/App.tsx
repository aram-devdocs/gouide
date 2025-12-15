/**
 * Desktop App Entry Point
 * STRICT TEMPLATE ARCHITECTURE: Only imports templates and hooks
 *
 * This file demonstrates the clean separation:
 * - Import AppShell template from @gouide/frontend-ui
 * - Import hooks from @gouide/frontend-hooks
 * - Wire hook data to AppShell
 * - No UI composition, no atoms/organisms imports
 */

import {
  DaemonProvider,
  useDaemonConnection,
  useWorkspace,
  WorkspaceProvider,
} from "@gouide/frontend-hooks";
import { AppShell } from "@gouide/frontend-ui";

function AppContent() {
  const workspace = useWorkspace();
  const daemon = useDaemonConnection();

  return <AppShell workspace={workspace} daemon={daemon} />;
}

function App() {
  return (
    <DaemonProvider>
      <WorkspaceProvider>
        <AppContent />
      </WorkspaceProvider>
    </DaemonProvider>
  );
}

export default App;
