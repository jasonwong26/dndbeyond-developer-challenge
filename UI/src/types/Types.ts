export enum TalentsEnum {
  Chevron = "chevron", 
  Silverware = "silverware", 
  Cake = "cake", 
  Crown = "crown", 
  Boat = "boat", 
  Scuba = "scuba", 
  Lightning = "lightning", 
  Skull = "skull"
}

export interface Talent {
  key: TalentsEnum,
  title?: string,
  points: number
}
export interface TalentPath {
  title: string
  talents: Talent[]
}
export interface TalentConfiguration {
  paths: TalentPath[]
  maxPoints: number,
  activeTalents: TalentsEnum[]
}
