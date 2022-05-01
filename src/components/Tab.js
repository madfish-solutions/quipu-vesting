/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import useBeacon from "../hooks/useBeacon";

export const Tab = ({
  onClick,
  selected = false,
  disabled,
  admin,
  children,
}) => {
  const { storage, pkh } = useBeacon();
  const isAdmin = storage && storage.admin === pkh && admin;
  const handleClick = () => {
    if (onClick && !disabled) {
      if (admin && !isAdmin) return false;
      onClick();
    }
  };

  return (
    <div
      className={`material-tabs-content ${
        (disabled || (admin && !isAdmin)) && "material-tabs-disabled"
      }`}
    >
      <a onClick={handleClick} className="material-tabs-content" href="#">
        {children}
      </a>
      {selected && <div className="material-tabs-underline"></div>}
    </div>
  );
};
