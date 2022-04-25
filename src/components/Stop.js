import React, { useState, useCallback } from "react";
import useBeacon from "../hooks/useBeacon";
import { Button } from "./Button";

export const Stop = () => {
  const { contract, storage, pkh, Tezos } = useBeacon();

  const [vestingId, setVestingId] = useState("");

  const handleStopVesting = useCallback(
    async (id) => {
      if (!contract) return;
      const stopVestingParams = contract.methodsObject.stop_vesting(id);
      const batchOp = Tezos.wallet.batch().withContractCall(stopVestingParams);
      await batchOp.send();
    },
    [contract, Tezos.wallet]
  );

  return (
    <section>
      <div className="section-content">
        <h3>Stop vesting by id</h3>
        <div>
          <div>
            <input
              name="vestingId"
              value={vestingId}
              placeholder={"vestingId"}
              onChange={(e) => setVestingId(e.target.value)}
            />
          </div>
          <Button
            disabled={storage && pkh !== storage.admin}
            onClick={handleStopVesting}
            className="distribute-button"
          >
            Stop Vesting
          </Button>
        </div>
      </div>
    </section>
  );
};
