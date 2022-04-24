import React from "react";
import useBeacon from "../hooks/useBeacon";
import { useTabs } from "../hooks/useTabs";
import { Button } from "./Button";
import { Tab } from "./Tab";
import { Tabs } from "./Tabs";

export const Header = () => {
  const { connect, disconnect, pkh } = useBeacon();
  const { TABS, currentTab, setCurrentTab } = useTabs();

  const handleConnect = () => {
    connect().catch(console.log);
  };

  const handleDisconnect = () => {
    disconnect().catch(console.log);
  };
  return (
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
        {!pkh && <Button onClick={handleConnect}>Connect</Button>}
        {pkh && typeof pkh === "string" && (
          <Button variant={"outlined"} onClick={handleConnect}>
            {pkh.slice(0, 6)}...${pkh.slice(-3)}
          </Button>
        )}
        {pkh && (
          <Button onClick={handleDisconnect} variant="filled">
            Disconnect
          </Button>
        )}
      </div>
    </header>
  );
};
