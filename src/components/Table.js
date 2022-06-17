import React from "react";
import { useRewards } from "../hooks/useRewards";
import { TokenRow } from './TokenRow';

export const Table = ({ rewards, tokens }) => {
  const { loadingRewards: loading } = useRewards();

  return (
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
          ) : (
            <tr>
              <td></td>
              <td></td>
              <td>Not found</td>
            </tr>
          )
        ) : (
          rewards.map((reward) => <TokenRow key={reward.id} reward={reward} index={reward.id} tokens={tokens} />)
        )}
      </tbody>
    </table>
  );
};
