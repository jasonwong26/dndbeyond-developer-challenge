import * as ts from "io-ts";

const HitDiceValuesEnum = ts.union([
  ts.literal(6),
  ts.literal(8),
  ts.literal(10),
  ts.literal(12)
]);
export type HitDiceValues = ts.TypeOf<typeof HitDiceValuesEnum>

const CharacterClassModel = ts.type({
  name: ts.string,
  hitDiceValue: ts.number,
  classLevel: ts.number
});
const CharacterAttributesModel = ts.type({
  strength: ts.number,
  dexterity: ts.number,
  constitution: ts.number,
  intelligence: ts.number,
  wisdom: ts.number,
  charisma: ts.number
});

const CharacterItemModel = ts.type({
  name: ts.string,
  modifier: ts.type({
    affectedObject: ts.string,
    affectedValue: ts.string,
    value: ts.number
  })
});
const CharacterDefenseModel = ts.type({
  type: ts.string,
  defense: ts.string
});
const CreateCharacterRequestRequired = ts.type({
  name: ts.string,
  level: ts.number,
  classes: ts.array(ts.exact(CharacterClassModel)),
  stats: ts.exact(CharacterAttributesModel)
});
const CreateCharacterRequestOptional = ts.partial({
  items: ts.array(ts.exact(CharacterItemModel)),
  defenses: ts.array(ts.exact(CharacterDefenseModel))
});

export const CreateCharacterRequestModel = ts.intersection([
  CreateCharacterRequestRequired,
  CreateCharacterRequestOptional
]);
export type CreateCharacterRequest = ts.TypeOf<typeof CreateCharacterRequestModel>


export const UpdateHpRequestModel = ts.type({
  type: ts.string,
  value: ts.number
});
export type UpdateHpRequest = ts.TypeOf<typeof UpdateHpRequestModel>

export const SetHpRequestModel = ts.type({
  value: ts.number
});
export type SetHpRequest = ts.TypeOf<typeof SetHpRequestModel>

export const SetTempHpRequestModel = ts.type({
  value: ts.number,
  override: ts.boolean
});
export type SetTempHpRequest = ts.TypeOf<typeof SetTempHpRequestModel>
