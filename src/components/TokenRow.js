import React, { useCallback } from "react";
import useBeacon from "../hooks/useBeacon";
import BigNumber from "bignumber.js";
import { Button } from "./Button";

const tenIn18 = new BigNumber(10).pow(18);

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
  const tenInDecimals = new BigNumber(10).pow(token.decimals)
  const fullReward = reward.treasury.div(
    tenInDecimals
  );
  const collected = reward.collected.div(
    tenInDecimals
  );

  const dt = reward.treasury.times(tenIn18.times(1000)).div(reward.distr_speed_f)

  const t0 = new Date(reward.deadline).getTime() - dt.toNumber();

  const dtDays = Math.floor(dt / (1000 * 60 * 60 * 24));

  const left = Date.now() < new Date(reward.deadline).getTime() ? reward.treasury.times((Date.now() - t0) / dt).minus(reward.collected).div(tenInDecimals) : new BigNumber(-1)
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
        {/* {left.toFixed()} */}
        {leftLabel}
      </td>
      <td>
        {dtDays} days
        {/* ({new Date(reward.deadline).toDateString()}) */}
      </td>
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
