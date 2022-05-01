import { useCallback, useState, useEffect } from "react";
import constate from "constate";

import useBeacon from "./useBeacon";

export const [UseRewardsProvider, useRewards] = constate(() => {
  const { storage, pkh } = useBeacon();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRewards = useCallback(async () => {
    if (!storage || !storage.vestings_counter || !pkh) {
      setLoading(false);
      return;
    }
    const limit = storage.vestings_counter;
    let arr = [];
    for (let i = 0; i < limit; i++) {
      const vesting = await storage.vestings.get([i]);
      arr.push(vesting);
    }
    if (pkh) {
      // arr = arr.filter((x) => x.receiver === pkh || x.admin !== pkh); // for debug
      arr = arr.filter((x) => x.receiver === pkh || x.admin === pkh);
    }
    setRewards(arr);
    setLoading(false);
  }, [storage, pkh]);

  useEffect(() => {
    loadRewards();
  }, [loadRewards]);

  return {
    rewards,
    loadingRewards: loading,
    loadRewards,
  };
});
