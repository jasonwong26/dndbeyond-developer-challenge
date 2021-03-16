import React from "react";
import { TalentsEnum } from "../../../types"
import { TrackedTalent } from "../Types"
import "./TalentTile.scss";

interface Props {
  talent: TrackedTalent,
  onActivate?: (key: TalentsEnum) => void,
  onDeactivate?: (key: TalentsEnum) => void
}

export const TalentTile: React.FC<Props> = ({talent, onActivate: leftClickHandler, onDeactivate: rightClickHandler}) => {
  const classes = ["talent", talent.key];
  if(talent.active) classes.push("active");

  const disabled = !talent.active && !talent.enabled;
  if(disabled) classes.push("disabled");

  const onLeftClick: React.MouseEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    leftClickHandler && leftClickHandler(talent.key);
  };

  const onRightClick: React.MouseEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    rightClickHandler && rightClickHandler(talent.key);
  };

  return (
    <button name={talent.toString()} className={classes.join(" ")} disabled={disabled} onClick={onLeftClick} onContextMenu={onRightClick}></button>
  );
};