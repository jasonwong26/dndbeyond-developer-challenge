import clonedeep from "lodash.clonedeep";
import * as Types from "../types";
import { parseExact } from "./ObjectValidator";

describe("type validation", () => {
  // base model used for testing
  const model: Types.CreateCharacterRequest = {
    name: "Briv",
    level: 5,
    classes: [{
      name: "fighter",
      hitDiceValue: 10,
      classLevel: 3
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
    }]
  };

  describe("parseExact", () => {
    it("parses a valid object", () => {
      const input: Types.CreateCharacterRequest = clonedeep(model);
      input.items = undefined;
      input.defenses = undefined;

      const output = parseExact(Types.CreateCharacterRequestModel, input);

      expect(output).toBeTruthy();
      expect(output).toEqual(input);
    });
    it("throws error on invalid object", () => {
      const { name, level } = model;
      const input = {
        name, level
      };

      expect(() => {
        parseExact(Types.CreateCharacterRequestModel, input)
      })
        .toThrow("Input does not match expected model.");
    });
    it("strips invalid properties from input object", () => {
      const { name, level, classes, stats } = model;
      const input = {
        name, level, classes, stats, invalidProperty: true
      };

      const output = parseExact(Types.CreateCharacterRequestModel, input);

      expect(output).toBeTruthy();
      expect(output).not.toHaveProperty("invalidProperty");
    });
    it("strips invalid properties from nested object", () => {
      const { name, level, classes, stats } = model;
      const alteredStats = { ...stats, strength: 9, lucky: 99 };
      const input = {
        name, level, classes, stats: alteredStats
      };

      const output = parseExact(Types.CreateCharacterRequestModel, input);

      expect(output).toBeTruthy();
      expect(output.stats).not.toHaveProperty("lucky");
    });
    it("strips invalid properties from nested array object", () => {
      const { name, level, classes, stats } = model;
      const [firstClass, ...rest] = classes;
      const alteredClass = { ...firstClass, coolnessFactor: 99 }
      const alteredClasses = [alteredClass, ...rest];
      const input = {
        name, level, classes: alteredClasses, stats
      };

      const output = parseExact(Types.CreateCharacterRequestModel, input);
      expect(output).toBeTruthy();
      expect(output.classes[0]).not.toHaveProperty("coolnessFactor");
    });
    it("parses multiple elements in array object", () => {
      const input: Types.CreateCharacterRequest = clonedeep(model);
      input.classes.push({
        name: "wizard",
        hitDiceValue: 6,
        classLevel: 2
      });

      const output = parseExact(Types.CreateCharacterRequestModel, input);
      expect(output).toBeTruthy();
    });
  });
});
