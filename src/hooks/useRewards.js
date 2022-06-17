import { useCallback, useState, useEffect } from "react";
import constate from "constate";

import useBeacon from "./useBeacon";

export const [UseRewardsProvider, useRewards] = constate(() => {
  const { storage } = useBeacon();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRewards = useCallback(async () => {
    // if (!storage || !storage.vestings_counter || !pkh) {
    if (!storage || !storage.vestings_counter) {
      setLoading(true);
      // if (!pkh) setRewards([]);
      return;
    }
    const limit = storage.vestings_counter;
    let arr = [];
    for (let i = 0; i < limit; i++) {
      const vesting = await storage.vestings.get([i]);
      arr.push(vesting);
    }
    arr = arr
      .map((_, index) => ({ ..._, id: index }))
    // if (pkh) {
    //   // arr = arr
    //   // .map((_, index) => ({ ..._, id: index }))
    //   // .filter((x) => x.receiver === pkh || x.admin !== pkh); // for debug
    //   // .filter((x) => x.receiver === pkh || x.admin === pkh);
    // }
    setRewards(arr);
    setLoading(false);
  }, [storage]);

  useEffect(() => {
    loadRewards();
  }, [loadRewards]);

  return {
    rewards,
    loadingRewards: loading,
    loadRewards,
  };
});
