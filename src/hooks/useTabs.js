import constate from "constate";
import { useState } from "react";
import { ChangeAdmin } from "../components/ChangeAdmin";
import { Distribute } from "../components/Distribute";
import { Explore } from "../components/Explore";
import { Stop } from "../components/Stop";

const TABS = [
  { label: "Explore", component: Explore },
  { label: "Distribute", component: Distribute },
  { label: "Stop vesting", component: Stop },
  { label: "Change Admin", component: ChangeAdmin },
];

export const [UseTabsProvider, useTabs] = constate(() => {
  const [currentTab, setCurrentTab] = useState(0);

  return { currentTab, setCurrentTab, TABS };
});
