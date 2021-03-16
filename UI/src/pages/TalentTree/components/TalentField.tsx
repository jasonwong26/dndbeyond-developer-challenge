import React from "react";
import "./TalentField.scss";

export const TalentField: React.FC = ({children}) => {
  // disable contet menu within field
  const onContextMenu: React.MouseEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="talent-field" onContextMenu={onContextMenu}>
      {children}
    </div>
  );
};