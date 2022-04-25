import React, { useState, useCallback } from "react";
import BigNumber from "bignumber.js";
import useBeacon, { contractAddress } from "../hooks/useBeacon";
import { Button } from "./Button";

export const Distribute = () => {
  const [value, setValue] = useState("");
  const [errorJSON, setJSONError] = useState(null);
  const { contract, storage, pkh, Tezos } = useBeacon();

  const [{ asset, assetId, amount, receiver, deadline }, setFormValue] =
    useState({
      asset: "",
      assetId: "",
      amount: "",
      receiver: "",
      deadline: "",
    });

  const [vestingId, setVestingId] = useState("");
  const [adminAddr, setAdminAddr] = useState("");

  const handleChange = (e) => {
    handleFormValue(e.target.name, e.target.value);
  };

  const handleFormValue = (name, value) => {
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeTextArea = (e) => {
    setJSONError(null);
    setValue(e.target.value);
    try {
      JSON.parse(e.target.value);
    } catch (e) {
      setJSONError(`Invalid JSON: ${e.message}`);
    }
  };

  const handleDistributeForm = () =>
    makeRpcCall({ asset, assetId, amount, receiver, deadline });

  const handleDistributeJSON = () => {
    if (errorJSON) {
      return;
    }
    makeRpcCall(JSON.parse(value));
  };

  const handleStopVesting = useCallback(
    async (id) => {
      if (!contract) return;
      const stopVestingParams = contract.methodsObject.stop_vesting(id);
      const batchOp = Tezos.wallet.batch().withContractCall(stopVestingParams);
      await batchOp.send();
    },
    [contract, Tezos.wallet]
  );

  const handleSetAdmin = useCallback(
    async (adminAddress) => {
      if (!contract) return;
      const adminParams = contract.methodsObject.set_admin(adminAddress);
      const batchOp = Tezos.wallet.batch().withContractCall(adminParams);
      await batchOp.send();
    },
    [contract, Tezos.wallet]
  );

  const makeRpcCall = async ({
    asset,
    assetId,
    amount,
    receiver,
    deadline,
  }) => {
    const isFa2 = !!assetId || assetId === "0";
    const isTez = asset === "tz";
    const assetParam = isFa2
      ? { fa2: { token: asset, id: Number(assetId) } } //{ token: asset, id: new BigNumber(assetId) } //
      : isTez
      ? { tez: null }
      : { fa12: asset };

    const amountParam = new BigNumber(amount);
    const deadlineParam = new BigNumber(
      new Date(deadline).getTime()
    ).dividedToIntegerBy(1000);
    const tx_prm = {
      asset: assetParam,
      amount: amountParam,
      receiver: receiver,
      deadline: deadlineParam,
    };
    const vestingParams = contract.methodsObject.start_vesting(tx_prm);
    try {
      let batchOp;
      if (isFa2) {
        const tokenContract = await Tezos.contract.at(asset);
        const addOperatorParams = tokenContract.methods.update_operators([
          {
            add_operator: {
              owner: pkh,
              operator: contractAddress,
              token_id: assetId,
            },
          },
        ]);
        const removeOperatorParams = tokenContract.methods.update_operators([
          {
            remove_operator: {
              owner: pkh,
              operator: contractAddress,
              token_id: assetId,
            },
          },
        ]);
        batchOp = Tezos.wallet
          .batch()
          .withContractCall(addOperatorParams)
          .withContractCall(vestingParams)
          .withContractCall(removeOperatorParams)
          .send();
      } else if (isTez) {
        batchOp = Tezos.wallet
          .batch()
          .withContractCall(vestingParams)
          .send({
            amount: asset === "tez" ? amountParam : 0,
          });
      } else {
        const tokenContract = await Tezos.contract.at(asset);
        const approveParams = tokenContract.methods.approve(
          contractAddress,
          amount
        );
        batchOp = Tezos.wallet
          .batch()
          .withContractCall(approveParams)
          .withContractCall(vestingParams)
          .send();
      }
      await batchOp;
      await batchOp.confirmation();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <section>
      <div className="section-content">
        <h3>Fill form</h3>
        <div className="fill-form">
          <div>
            <label>Asset Address</label>
            <input
              name="asset"
              value={asset}
              placeholder={"tez or FA1.2 Address"}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Asset Id</label>
            <input
              name="assetId"
              value={assetId}
              placeholder={"for FA2"}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Amount</label>
            <input
              name="amount"
              value={amount}
              placeholder={"amount"}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Receiver</label>
            <input
              name="receiver"
              value={receiver}
              placeholder={"receiver"}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Deadline</label>
            <input
              name="deadline"
              value={deadline}
              type="date"
              placeholder={"deadline"}
              onChange={handleChange}
            />
          </div>
          <Button
            disabled={storage && pkh !== storage.admin}
            onClick={handleDistributeForm}
            className="distribute-button"
          >
            Distribute
          </Button>
        </div>
        <h3>Or use JSON text</h3>
        <div>
          <div className="textarea">
            <textarea
              value={value}
              onChange={handleChangeTextArea}
              placeholder='{ receiver:"tz1...", amount: "100" }'
            />
          </div>
          {errorJSON && typeof errorJSON === "string" && (
            <div className="textarea-error">{errorJSON}</div>
          )}

          <Button
            disabled={storage && pkh !== storage.admin}
            onClick={handleDistributeJSON}
            className="distribute-button"
          >
            Distribute
          </Button>
        </div>
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
