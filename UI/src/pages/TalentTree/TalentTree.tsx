import * as React from "react";
import { TalentConfiguration, TalentsEnum } from "../../types";
import { Container, TalentField, TalentTreeTitle, PointSummary, TalentPath } from "./components";
import "./TalentTree.scss";

// Example Data model 
const talents: TalentConfiguration = {
  maxPoints: 6,
  paths: [
    {
      title: "Talent Path 1",
      talents: [
        { key: TalentsEnum.Chevron, points: 1 },
        { key: TalentsEnum.Silverware, points: 1 },
        { key: TalentsEnum.Cake, points: 1 },
        { key: TalentsEnum.Crown, points: 1 }
      ]
    },
    {
      title: "Talent Path 2",
      talents: [
        { key: TalentsEnum.Boat, points: 1 },
        { key: TalentsEnum.Scuba, points: 1 },
        { key: TalentsEnum.Lightning, points: 1 },
        { key: TalentsEnum.Skull, points: 1 }
      ]
    }],
  activeTalents: [
    TalentsEnum.Chevron,
    TalentsEnum.Boat,
    TalentsEnum.Scuba]
};

export const TalentTree: React.FC = () => {
  return (
    <header className="talent-tree">
      <Container configuration={talents}>
        {(points, maxPoints, paths, onActivate, onDeactivate) => (
          <TalentField>
            <TalentTreeTitle title="TitanStar Legends - Rune Mastery Loadout Talent Calculator 9000" />
            <div className="tree-container">
              <div className="summary-wrapper">
                <PointSummary points={points} maxPoints={maxPoints} />
              </div>
              <div className="paths-wrapper">
                {paths.map((p, i) => (
                  <TalentPath key={i} path={p} onActivate={onActivate} onDeactivate={onDeactivate} />
                ))}
              </div>
            </div>
          </TalentField>
        )}
      </Container>
    </header>
  );
};