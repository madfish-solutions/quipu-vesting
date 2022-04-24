import { useState } from "react";
import "./material-button.css";
import "./material-tabs.css";
import "./App.css";
import { Button } from "./components/Button";
import { Tabs } from "./components/Tabs";
import { Tab } from "./components/Tab";
import { Distribute } from "./components/Distribute";
import { Explore } from "./components/Explore";

const mockAddress = "tz12345678987123123126t5r4e321";

const TABS = [
  { label: "Distribute", component: Distribute },
  { label: "Explore", component: Explore },
];

function App() {
  const [connected, setConnected] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);

  const handleConnect = () => {
    setConnected(mockAddress);
  };

  const handleDisconnect = () => {
    setConnected(null);
  };

  const SelectedTab = TABS[currentTab].component;

  return (
    <div className="App">
      <header className="App-header">
        <Tabs>
          {TABS.map((tab, index) => (
            <Tab
              onClick={() => setCurrentTab(index)}
              selected={currentTab === index}
              key={index}
            >
              {tab.label}
            </Tab>
          ))}
        </Tabs>
        <div className="header-buttons">
          {!connected && <Button onClick={handleConnect}>Connect</Button>}
          {connected && typeof connected === "string" && (
            <Button variant={"outlined"} onClick={handleConnect}>
              {connected.slice(0, 6)}...${connected.slice(-3)}
            </Button>
          )}
          {connected && (
            <Button onClick={handleDisconnect} variant="filled">
              Disconnect
            </Button>
          )}
        </div>
      </header>
      <main>
        <SelectedTab />
      </main>
    </div>
  );
}

export default App;
