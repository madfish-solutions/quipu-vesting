import React, { useCallback, useEffect, useState } from "react";
import useBeacon from "../hooks/useBeacon";
import { getTokensMetadata } from "../utils/tokenMetadata.api";
import { RefreshableButton } from "./RefreshableButton";
import { useRewards } from "../hooks/useRewards";
import { Table } from './Table';

export const Explore = () => {
  const { pkh } = useBeacon();
  const [tokens, setTokens] = useState([]);
  const { rewards, loadRewards } = useRewards();

  const loadTokensMetadata = useCallback(async () => {
    if (rewards.length === 0) {
      return;
    }
    console.log('loadTokensMetadata');
    let newTokens = [];
    for (var i = 0; i < rewards.length; i++) {
      let token = null;
      if (rewards[i].asset["fa2"]) {
        token = await getTokensMetadata(
          rewards[i].asset.fa2.token,
          rewards[i].asset.fa2.id.toString()
        );
      } else if (rewards[i].asset["fa12"]) {
        token = await getTokensMetadata(rewards[i].asset.fa12, 0);
      } else {
        token = {
          decimals: 6,
          name: "TEZ",
          symbol: "TEZ",
          thumbnailUri:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Tezos_logo.svg/100px-Tezos_logo.svg.png",
        };
      }

      newTokens.push(token);
    }
    setTokens(newTokens);
  }, [rewards]);

  useEffect(() => {
    loadTokensMetadata();
  }, [loadTokensMetadata]);

  return (
    <section>
      <div className="search-bar"></div>

      <h3 className='pad'>Your rewards:</h3>
      <Table tokens={tokens} rewards={rewards.filter(x => x.receiver === pkh || x.admin === pkh)} />
      <h3 className='pad'>All rewards:</h3>
      <Table tokens={tokens} rewards={rewards.filter(x => x.receiver !== pkh)} />
      {pkh && (
        <RefreshableButton callback={() => loadRewards()} />
      )}
    </section>
  );
};
