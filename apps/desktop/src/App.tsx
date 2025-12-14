import { Shell } from "./components/Shell";
import { DaemonProvider } from "./hooks/useDaemonConnection";

function App() {
  return (
    <DaemonProvider>
      <Shell />
    </DaemonProvider>
  );
}

export default App;
