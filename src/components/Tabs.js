import React from "react";

export const Tabs = ({ children }) => {
  return (
    <div className="material-tabs">
      {children}
      <span className="yellow-bar"></span>
    </div>
  );
};
