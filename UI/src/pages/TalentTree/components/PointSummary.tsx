import React from "react";
import "./PointSummary.scss";

interface Props {
  points: number,
  maxPoints: number
}

export const PointSummary: React.FC<Props> = ({ points, maxPoints }) => (
  <div className="point-summary">
    <div className="points-used">{points} / {maxPoints}</div>
    <div className="legend">Points Spent</div>
  </div>
);