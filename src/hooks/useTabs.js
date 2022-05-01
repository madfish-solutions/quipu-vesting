import constate from "constate";
import { useState } from "react";
import { ChangeAdmin } from "../components/ChangeAdmin";
import { Distribute } from "../components/Distribute";
import { Explore } from "../components/Explore";
import { Stop } from "../components/Stop";

const TABS = [
  { label: "Explore", component: Explore },
  { label: "Distribute", component: Distribute, admin: true },
  { label: "Stop vesting", component: Stop, admin: true },
  { label: "Change Admin", component: ChangeAdmin, admin: true },
];

export const [UseTabsProvider, useTabs] = constate(() => {
  const [currentTab, setCurrentTab] = useState(0);

  return { currentTab, setCurrentTab, TABS };
});
