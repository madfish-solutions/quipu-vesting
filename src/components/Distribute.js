import React from "react";
import { Button } from "./Button";

export const Distribute = () => {
  const handleDistribute = () => {
    // submit
  };
  return (
    <section>
      <div className="section-content">
        <textarea value="" placeholder='{ receiver:"tz1...", amount: "100" }' />
        <Button onClick={handleDistribute} className="distribute-button">
          Distribute
        </Button>
      </div>
    </section>
  );
};
