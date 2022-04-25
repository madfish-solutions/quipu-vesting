import React, { useCallback, useEffect, useState } from "react";
import useBeacon from "../hooks/useBeacon";
import BigNumber from "bignumber.js";
import { getTokensMetadata } from "../utils/tokenMetadata.api";
import { Button } from "./Button";
import { RefreshableButton } from "./RefreshableButton";

export const Explore = () => {
  const { contract, storage, pkh, connect, Tezos } = useBeacon();
  const [rewards, setRewards] = useState([]);
  const [tokens, setTokens] = useState([]);
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
      arr = arr.filter((x) => x.receiver === pkh || x.admin !== pkh); // for debug
      // arr = arr.filter((x) => x.receiver === pkh || x.admin === pkh);
    }
    console.log(arr);
    setRewards(arr);
    setLoading(false);
  }, [storage, pkh]);

  const loadTokensMetadata = useCallback(async () => {
    if (rewards.length === 0) {
      return;
    }
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

      setTokens((prev) => [...prev, token]);
    }
  }, [rewards, pkh]);

  useEffect(() => {
    loadRewards();
  }, [loadRewards]);

  useEffect(() => {
    loadTokensMetadata();
  }, [loadTokensMetadata]);

  const handleClaim = useCallback(
    async (id) => {
      if (!contract) return;
      const claimParams = contract.methodsObject.claim(id);
      const batchOp = Tezos.wallet.batch().withContractCall(claimParams);
      await batchOp.send();
    },
    [contract]
  );

  const handleConnect = () => {
    connect().catch(console.log);
  };
  return (
    <section>
      <div className="search-bar"></div>
      <table>
        <thead>
          <tr>
            <th>Full Reward</th>
            <th>Claimed</th>
            <th>Pending</th>
            <th>Ends in</th>
            <th>{/* action button */}</th>
          </tr>
        </thead>
        <tbody>
          {rewards.length === 0 ? (
            loading ? (
              <tr>
                <td></td>
                <td></td>
                <td>Loading</td>
              </tr>
            ) : !pkh ? (
              <tr>
                <td></td>
                <td></td>
                <td>
                  <Button onClick={handleConnect}>Connect to continue</Button>
                </td>
              </tr>
            ) : (
              <tr>
                <td></td>
                <td></td>
                <td>Not found</td>
              </tr>
            )
          ) : (
            rewards.map((reward, index) => {
              const token =
                tokens.length > 0
                  ? {
                      symbol: tokens[index].symbol,
                      decimals: tokens[index].decimals,
                    }
                  : { symbol: "Loading", decimals: 6 };
              const tokenName = token.symbol.substring(0, 7) + "...";
              const fullReward = reward.treasury.div(
                new BigNumber(10).pow(token.decimals)
              );
              const collected = reward.collected.div(
                new BigNumber(10).pow(token.decimals)
              );

              const left = fullReward.minus(collected);
              return (
                <tr key={index}>
                  <td>
                    {fullReward.toFixed(0)} {tokenName}
                  </td>
                  <td>
                    {collected.toFixed(0)} {tokenName}
                  </td>
                  <td>
                    {left.toFixed(0)} {tokenName}
                  </td>
                  <td>{new Date(reward.deadline).toDateString()}</td>
                  <td>
                    <Button
                      disabled={!pkh || left.toFixed(0) === "0"}
                      onClick={() => handleClaim(index)}
                    >
                      Claim
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
          {pkh && (
            <tr>
              <td></td>
              <td></td>
              <td>
                <RefreshableButton callback={() => loadRewards()} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};
