import React from "react";
import { TalentsEnum } from "../../../types"
import { TrackedTalentPath } from "../Types"
import { TalentTile } from "./TalentTile";
import "./TalentPath.scss";

interface Props {
  path: TrackedTalentPath,
  onActivate?: (talent: TalentsEnum) => void
  onDeactivate?: (talent: TalentsEnum) => void
}
export const TalentPath: React.FC<Props> = ({path, onActivate: onLeftClick, onDeactivate: onRightClick}) => {
  const divider = (active: boolean, i: number, length: number) => {
    if(i >= length - 1) return null;
    const classes = ["talent-divider"];
    if(active) classes.push("active");  
    return (
      <div className={classes.join(" ")}></div>
    );
  }

  return (
    <div className="talent-path">
      <div className="talent-path-talents">
        <div className="talent-path-title">{path.title}</div>
        {path.talents.map((t, i) => (
          <React.Fragment key={t.key}>
            <TalentTile talent={t} onActivate={onLeftClick} onDeactivate={onRightClick} />
            {divider(t.active, i, path.talents.length)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};