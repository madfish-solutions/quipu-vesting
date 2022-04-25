import React, { useEffect, useState } from "react";
import { Button } from "./Button";

export const BLOCK_TIME = 30;
const ONE_SEC = 1000;

export const RefreshableButton = ({ callback }) => {
  const [block, blockUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      blockUpdate(block + 1);
    }, ONE_SEC);

    if (block > BLOCK_TIME) {
      handleRefresh();
    }

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block]);

  const handleRefresh = () => {
    blockUpdate(0);
    callback();
  };
  const percentage = ((BLOCK_TIME - block) / BLOCK_TIME) * 100;
  return (
    <Button
      onClick={handleRefresh}
      style={{
        background: `linear-gradient(90deg, rgb(33, 150, 243) ${percentage}%, rgb(60, 170, 243) ${percentage}%)`,
      }}
    >
      Refresh
    </Button>
  );
};
