import clonedeep from "lodash.clonedeep"

import * as Types from "../shared";
import * as Helper from "./hpCalculations";

describe("Helper Functions", () => {
  // base model used for testing
  const model: Types.Character = {
    id: "test",
    hp: 45,
    maxHp: 45,
    tempHp: 0,
    name: "Briv",
    level: 5,
    classes: [{
      name: "fighter",
      hitDiceValue: 10,
      classLevel: 5
    }],
    stats: {
      strength: 15,
      dexterity: 12,
      constitution: 14,
      intelligence: 13,
      wisdom: 10,
      charisma: 8
    },
    items: [{
      name: "Ioun Stone of Fortitude",
      modifier: {
        affectedObject: "stats",
        affectedValue: "constitution",
        value: 2
      }
    }],
    defenses: [{
      type: "fire",
      defense: "immunity"
    },
    {
      type: "cold",
      defense: "resistance"
    },
    {
      type: "necrotic",
      defense: "vulnerable"
    }]
  };
  describe("calculateFixedHp", () => {
    it("normal case", () => {
      const input = model;

      const output = Helper.calculateFixedHp(input);
  
      expect(output).toEqual(45);
    });
    it("multiclass", () => {
      const input = clonedeep(model);
      input.classes[0].classLevel = 3;
      input.classes.push({
        name: "wizard",
        classLevel: 2,
        hitDiceValue: 6
      });

      const output = Helper.calculateFixedHp(input);
  
      expect(output).toEqual(41);
    });
  });
  describe("fetchAttributeScore", () => {
    it("strength", () => {
      const input = model;

      const output = Helper.fetchAttributeScore(input, "strength");
  
      expect(output).toEqual(15);
    });
    it("constitution with item", () => {
      const input = model;

      const output = Helper.fetchAttributeScore(input, "constitution");
  
      expect(output).toEqual(16);
    });
    it("constitution without item", () => {
      const input = clonedeep(model);
      input.items = undefined;

      const output = Helper.fetchAttributeScore(input, "constitution");
  
      expect(output).toEqual(14);
    });

  });
  describe("calculateModifier", () => {
    it("10 => 0", () => {
      const input = 10;

      const output = Helper.calculateModifier(input);
  
      expect(output).toEqual(0);
    });
    it("15 => 2 (odd numbers rounded down)", () => {
      const input = 15;

      const output = Helper.calculateModifier(input);
  
      expect(output).toEqual(2);
    });
    it("20 => 5", () => {
      const input = 20;

      const output = Helper.calculateModifier(input);
  
      expect(output).toEqual(5);
    });
    it("5 => -3", () => {
      const input = 5;

      const output = Helper.calculateModifier(input);
  
      expect(output).toEqual(-3);
    });


  });
  describe("calculateAverageRoll", () => {
    it("d6", () => {
      const input = 6;

      const output = Helper.calculateAverageRoll(input);
  
      expect(output).toEqual(4);
    });
    it("d8", () => {
      const input = 8;

      const output = Helper.calculateAverageRoll(input);
  
      expect(output).toEqual(5);
    });
    it("d10", () => {
      const input = 10;

      const output = Helper.calculateAverageRoll(input);
  
      expect(output).toEqual(6);
    });
    it("d12", () => {
      const input = 12;

      const output = Helper.calculateAverageRoll(input);
  
      expect(output).toEqual(7);
    });
  });
  describe("calculateHpChange", () => {
    it("normal case", () => {
      const character = model;
      const change: Types.UpdateHpRequest = {
        type: "slashing",
        value: -5
      }

      const output = Helper.calculateHpChange(character, change);
  
      expect(output).toEqual(-5);
    });
    it("immunity", () => {
      const character = model;
      const change: Types.UpdateHpRequest = {
        type: "fire",
        value: -5
      }

      const output = Helper.calculateHpChange(character, change);
  
      expect(output === 0).toBeTruthy();
    });
    it("resistance", () => {
      const character = model;
      const change: Types.UpdateHpRequest = {
        type: "cold",
        value: -5
      }

      const output = Helper.calculateHpChange(character, change);
  
      expect(output).toEqual(-2);
    });
    it("vulnerable", () => {
      const character = model;
      const change: Types.UpdateHpRequest = {
        type: "necrotic",
        value: -5
      }

      const output = Helper.calculateHpChange(character, change);
  
      expect(output).toEqual(-10);
    });
    it("healing", () => {
      const character = model;
      const change: Types.UpdateHpRequest = {
        type: "healing",
        value: 5
      }

      const output = Helper.calculateHpChange(character, change);
  
      expect(output).toEqual(5);
    });
    it("edge case - 0 value", () => {
      const character = model;
      const change: Types.UpdateHpRequest = {
        type: "slashing",
        value: 0
      }

      const output = Helper.calculateHpChange(character, change);
  
      expect(output === 0).toBeTruthy();
    });
  });
  describe("applyHpChange", () => {
    it("normal case", () => {
      const character = clonedeep(model);
      const input = -5;

      Helper.applyHpChange(character, input);
  
      expect(character.hp).toEqual(40);
      expect(character.tempHp === 0).toBeTruthy();
    });
    it("healing", () => {
      const character = clonedeep(model);
      character.hp = 40;
      const input = 4;

      Helper.applyHpChange(character, input);
  
      expect(character.hp).toEqual(44);
      expect(character.tempHp === 0).toBeTruthy();
    });
    it("healing does not exceed max hp", () => {
      const character = clonedeep(model);
      character.hp = 40;
      const input = 10;

      Helper.applyHpChange(character, input);
  
      expect(character.hp).toEqual(45);
    });
    it("healing does not effect temp hp", () => {
      const character = clonedeep(model);
      character.hp = 40;
      const input = 10;

      Helper.applyHpChange(character, input);
  
      expect(character.tempHp === 0).toBeTruthy();
    });
    it("damage first subtracts from temp hp - full hp", () => {
      const character = clonedeep(model);
      character.tempHp = 5;
      const input = -10;

      Helper.applyHpChange(character, input);
  
      expect(character.hp).toEqual(40);
      expect(character.tempHp === 0).toBeTruthy();
    });
    it("damage first subtracts from temp hp - partial hp", () => {
      const character = clonedeep(model);
      character.hp = 15;
      character.tempHp = 5;
      const input = -10;

      Helper.applyHpChange(character, input);
  
      expect(character.hp).toEqual(10);
      expect(character.tempHp === 0).toBeTruthy();
    });
    it("damage does not reduce hp below zero", () => {
      const character = clonedeep(model);
      const input = -999;

      Helper.applyHpChange(character, input);
      
      expect(character.hp === 0).toBeTruthy();
      expect(character.tempHp === 0).toBeTruthy();
    });
  });
  describe("calculateNewTempHp", () => {
    it("normal case", () => {
      const character = clonedeep(model);
      character.tempHp = 3;
      const input = 5;

      const output = Helper.calculateNewTempHp(character, input);
  
      expect(output).toEqual(5);
    });
    it("retain higher value", () => {
      const character = clonedeep(model);
      character.tempHp = 5;
      const input = 3;

      const output = Helper.calculateNewTempHp(character, input);
  
      expect(output).toEqual(5);
    });
  });
});