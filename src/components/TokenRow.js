import React, { useCallback } from "react";
import useBeacon from "../hooks/useBeacon";
import BigNumber from "bignumber.js";
import { Button } from "./Button";

export const TokenRow = ({ tokens, index, reward }) => {
  const { contract, pkh, Tezos } = useBeacon();

  const handleClaim = useCallback(
    async (id) => {
      if (!contract) return;
      const claimParams = contract.methodsObject.claim(id);
      const batchOp = Tezos.wallet.batch().withContractCall(claimParams);
      await batchOp.send();
    },
    [contract, Tezos.wallet]
  );
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

  const t0 = (new BigNumber(new Date(reward.deadline).getTime()).minus(reward.collected.div(reward.distr_speed_f.div(10 ** (18)))).toNumber())

  const left = fullReward.times((new Date(reward.deadline) - Date.now()) / (new Date(reward.deadline).getTime() - t0)).minus(collected)
  const leftLabel = left.lt(0) ? 'All collected' : left.gt(fullReward.minus(collected)) ? `${fullReward.minus(collected).toFixed(0)} ${tokenName}` : `${left.toFixed(0)} ${tokenName}`
  return (
    <tr>
      <td>
        {fullReward.toFixed(0)} {tokenName}
      </td>
      <td>
        {collected.toFixed(0)} {tokenName}
      </td>
      <td>
        {leftLabel}
      </td>
      <td>{new Date(reward.deadline).toDateString()}</td>
      <td>
        {(reward.receiver === pkh || reward.admin === pkh) && (<Button
          disabled={!pkh || left.toFixed(0) === "0"}
          onClick={() => handleClaim(reward.id)}
        >
          {reward.admin === pkh ? 'Claim as Admin' : 'Claim'}
        </Button>)}
      </td>
    </tr>
  );
};
