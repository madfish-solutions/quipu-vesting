import React, { useState } from "react";
import BigNumber from "bignumber.js";
import useBeacon from "../hooks/useBeacon";
import { Button } from "./Button";

export const Distribute = () => {
  const [value, setValue] = useState("");
  const [errorJSON, setJSONError] = useState(null);
  const { contract, storage, pkh } = useBeacon();

  const [{ asset, amount, receiver, deadline }, setFormValue] = useState({
    asset: "",
    amount: "",
    receiver: "",
    deadline: "",
  });

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
    makeRpcCall({ asset, amount, receiver, deadline });

  const handleDistributeJSON = () => {
    if (errorJSON) {
      return;
    }
    makeRpcCall(JSON.parse(value));
  };

  const makeRpcCall = async ({ asset, amount, receiver, deadline }) => {
    const vestingParams = contract.methods.start_vesting(
      new BigNumber(amount).multipliedBy(10 ** 8).toFixed(),
      receiver,
      deadline,
      asset || "tez"
    );
    try {
      await vestingParams.send();
    } catch (e) {
      console.log(e);
      alert(JSON.stringify(e));
    }
  };
  return (
    <section>
      <div className="section-content">
        <h3>Fill form</h3>
        <div className="fill-form">
          <div>
            <label>Asset</label>
            <input
              name="asset"
              value={asset}
              placeholder={"asset"}
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
      </div>
    </section>
  );
};
