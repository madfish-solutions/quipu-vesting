import React from "react";

export const Button = ({
  variant = "filled",
  onClick,
  className,
  children,
}) => {
  return (
    <button onClick={onClick} className={`button ${variant} ${className}`}>
      {children}
    </button>
  );
};
