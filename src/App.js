import { useState } from "react";
import "./material-button.css";
import "./material-tabs.css";
import "./App.css";
import { Button } from "./Button";
import { Tabs } from "./Tabs";
import { Tab } from "./Tab";

const mockAddress = "tz12345678987123123126t5r4e321";

const TABS = ["Distribute", "Explore"];

function App() {
  const [connected, setConnected] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);

  const handleConnect = () => {
    setConnected(mockAddress);
  };

  const handleDisconnect = () => {
    setConnected(null);
  };

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
              {tab}
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
        <section>
          <div className="search-bar"></div>
          <table>
            <thead>
              <tr>
                <th>Full Reward</th>
                <th>Claimed</th>
                <th>Pending</th>
                <th>Ends in</th>
                <th>{/* action button */}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1000 QUIPU</td>
                <td>1000 QUIPU</td>
                <td>1000 QUIPU</td>
                <td>25 nov 2013</td>
                <td>
                  <div className="button filled">Claim</div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default App;
