import * as Types from "../../types";

export interface TrackedTalent extends Types.Talent {
  active: boolean,
  enabled: boolean
}

export interface TrackedTalentPath extends Types.TalentPath {
  talents: TrackedTalent[]
}
