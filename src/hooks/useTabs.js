import constate from "constate";
import { useState } from "react";
import { Distribute } from "../components/Distribute";
import { Explore } from "../components/Explore";

const TABS = [
  { label: "Distribute", component: Distribute },
  { label: "Explore", component: Explore },
  // { label: "Stop vesting", component: Explore },
  // { label: "Change Admin", component: Explore },
];

export const [UseTabsProvider, useTabs] = constate(() => {
  const [currentTab, setCurrentTab] = useState(1);

  return { currentTab, setCurrentTab, TABS };
});
