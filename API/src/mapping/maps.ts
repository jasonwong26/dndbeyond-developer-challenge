import * as Types from "../types";

export const toCharacterHp = (character: Types.Character): Types.CharacterHp => {
  const { id, hp, maxHp, tempHp } = character;
  const output: Types.CharacterHp = {
    id, hp, maxHp, tempHp
  }

  return output;
}