import * as Types from "../shared";

// Rules:
//  Hp total equals sum of:
//  1) character level * constitution modifier (including adjustments)
//  2) class level * average dice roll for class
//  3) a character can have multiple classes
export const calculateFixedHp = (character: Types.CreateCharacterRequest | Types.Character): number => {
  // calculate hp from constitution score
  const constitutionScore = fetchAttributeScore(character, "constitution");
  const constitutionModifier = calculateModifier(constitutionScore);
  let hp = character.level * constitutionModifier;

  // calculate hp from class levels
  for (const c of character.classes) {
    const averageRoll = calculateAverageRoll(c.hitDiceValue);
    hp += c.classLevel * averageRoll;
  }

  return hp;
}
export const fetchAttributeScore = (character: Types.CreateCharacterRequest | Types.Character, attribute: keyof typeof character.stats): number => {
  const baseStat = character.stats[attribute] ?? 0;

  const itemModifier = (character.items ?? [])
    .filter(i => i.modifier.affectedObject === "stats" 
              && i.modifier.affectedValue === attribute)
    .reduce((sum, current) => sum + current.modifier.value, 0);

  const totalStat = baseStat + itemModifier;
  return totalStat;
}
export const calculateModifier = (stat: number): number => {
  return Math.floor((stat - 10) / 2);
}
// We can't roll zeroes, so average roll of a d6 is 3.5 - rounded up to 4.
export const calculateAverageRoll = (sides: number): number => {
  return Math.ceil((sides + 1) / 2);
}

const damageMultiplierMap = new Map<string, number>([
  ["immunity", 0],
  ["resistance", 0.5],
  ["vulnerable", 2]
]);

export const calculateHpChange = (character: Types.Character, change: Types.UpdateHpRequest): number => {
  // for zero and positive values, no need to calculate a modifier.
  if(change.value >= 0) return change.value;

  let multiplier = 1;
  const damagetype = change.type;
  for(const d of character.defenses ?? []) {
    if(d.type !== damagetype) continue;

    multiplier = damageMultiplierMap.get(d.defense) ?? 1;
  }

  // Javascript floor rounding for negative numbers is weird, use abs and reapply sign.
  const sign = Math.sign(change.value);
  const rounded = sign * Math.floor(Math.abs(change.value) * multiplier);
  return rounded;
}

// Rules:
//  1) healing does not affect temp hp
//  2) healing does not cause hp to exceed max hp
//  3) damage subtracts from temp hp first
//  4) damage does not cause hp to drop below 0
export const applyHpChange = (character: Types.CharacterHp, change: number): void => {
  // no effective change
  if(change === 0) return;

  // healing - does not affect temp hp
  if(change > 0) {
    character.hp = Math.min(character.hp + change, character.maxHp);
    return;
  }

  // damage - subtract from temp hp first
  const totalHp = character.hp + character.tempHp;
  const newHp = totalHp + change;

  character.tempHp = Math.max(newHp - character.hp, 0);
  character.hp = Math.max(newHp, 0);
}

// Rule: Always take the higher value
export const calculateNewTempHp = (character: Types.Character, change: number): number => {
  const current = character.tempHp;
  const newValue = change;

  return Math.max(current, newValue);
}
