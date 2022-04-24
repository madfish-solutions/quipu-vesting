import React from "react";
import { Button } from "./Button";

export const Explore = () => {
  const handleClaim = () => {
    // submit
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
          <tr>
            <td>1000 QUIPU</td>
            <td>1000 QUIPU</td>
            <td>1000 QUIPU</td>
            <td>25 nov 2013</td>
            <td>
              <Button onClick={handleClaim}>Claim</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};
