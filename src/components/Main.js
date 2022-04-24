import React from "react";
import { useTabs } from "../hooks/useTabs";

export const Main = () => {
  const { TABS, currentTab } = useTabs();
  const SelectedTab = TABS[currentTab].component;
  return (
    <main>
      <SelectedTab />
    </main>
  );
};
