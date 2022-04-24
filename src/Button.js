import React from "react";

export const Button = ({ variant = "filled", onClick, children }) => {
  return (
    <button onClick={onClick} className={`button ${variant}`}>
      {children}
    </button>
  );
};
