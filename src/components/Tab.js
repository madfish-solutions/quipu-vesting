/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

export const Tab = ({ onClick, selected = false, disabled, children }) => {
  const handleClick = () => onClick && !disabled && onClick();
  return (
    <div
      className={`material-tabs-content ${
        disabled && "material-tabs-disabled"
      }`}
    >
      <a onClick={handleClick} className="material-tabs-content" href="#">
        {children}
      </a>
      {selected && <div className="material-tabs-underline"></div>}
    </div>
  );
};
