/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

export const Tab = ({ onClick, selected = false, children }) => {
  return (
    <div className="material-tabs-content">
      <a onClick={onClick} className="material-tabs-content" href="#">
        {children}
      </a>
      {selected && <div className="material-tabs-underline"></div>}
    </div>
  );
};
