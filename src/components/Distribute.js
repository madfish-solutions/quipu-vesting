import React, { useState } from "react";
import { Button } from "./Button";

export const Distribute = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setError(null);
    setValue(e.target.value);
    try {
      JSON.parse(e.target.value);
    } catch (e) {
      setError(`Invalid JSON: ${e.message}`);
    }
  };

  const handleDistribute = () => {
    // submit
  };
  return (
    <section>
      <div className="section-content">
        <div className="textarea">
          <textarea
            value={value}
            onChange={handleChange}
            placeholder='{ receiver:"tz1...", amount: "100" }'
          />
        </div>
        {error && typeof error === "string" && (
          <div className="textarea-error">{error}</div>
        )}

        <Button onClick={handleDistribute} className="distribute-button">
          Distribute
        </Button>
      </div>
    </section>
  );
};
