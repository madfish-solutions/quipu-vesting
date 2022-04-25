import React, { useState, useCallback } from "react";
import useBeacon from "../hooks/useBeacon";
import { Button } from "./Button";

export const ChangeAdmin = () => {
  const { contract, storage, pkh, Tezos } = useBeacon();

  const [adminAddr, setAdminAddr] = useState("");

  const handleSetAdmin = useCallback(
    async (adminAddress) => {
      if (!contract) return;
      const adminParams = contract.methodsObject.set_admin(adminAddress);
      const batchOp = Tezos.wallet.batch().withContractCall(adminParams);
      await batchOp.send();
    },
    [contract, Tezos.wallet]
  );

  return (
    <section>
      <div className="section-content">
        <h3>Change Admin</h3>
        <div>
          <div>
            <input
              name="adminAddr"
              value={adminAddr}
              placeholder={"new admin address"}
              onChange={(e) => setAdminAddr(e.target.value)}
            />
          </div>
          <Button
            disabled={storage && pkh !== storage.admin}
            onClick={handleSetAdmin}
            className="distribute-button"
          >
            Set admin
          </Button>
        </div>
      </div>
    </section>
  );
};
