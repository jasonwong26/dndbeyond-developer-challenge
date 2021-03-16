import React from "react";
import "./TalentTreeTitle.scss";

interface Props {
  title: string
}

export const TalentTreeTitle: React.FC<Props> = ({ title }) => (
  <h2 className="talent-tree-title">{title}</h2>
);