import React from "react";
import useBeacon from '../hooks/useBeacon';
import { useTabs } from "../hooks/useTabs";
import { Button } from './Button';

export const Main = () => {
  const { TABS, currentTab } = useTabs();
  const SelectedTab = TABS[currentTab].component;
  const { vestingContract, setVesting } = useBeacon();
  const [value, setValue] = React.useState(vestingContract)

  const handleSetValue = (value) => {
    setValue(value);
  }

  const handleSubmit = () => {
    setVesting(value);
  }

  return (
    <main>
      <div className='exploreVesting'>
        <div className='vestingCol'>
          Explore another vesting:
          <input value={value} onChange={e => handleSetValue(e.target.value)} />
        </div>
        <Button variant={"outlined"} onClick={handleSubmit}>
          Show
        </Button>
      </div>
      <SelectedTab />
    </main>
  );
};
