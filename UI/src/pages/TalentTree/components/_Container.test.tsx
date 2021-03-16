import clonedeep from "lodash.clonedeep";

import { TalentConfiguration, TalentsEnum } from "../../../types";
import * as UnderTest from "./_Container";

describe("Container", () => {
  // base model used for testing
  const model: TalentConfiguration = {
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

  describe("buildTalents()", () => {
    it("normal case", () => {
      const input = clonedeep(model);

      const output = UnderTest.buildTalents(input);

      const keys = [...output.keys()];
      expect(keys.length).toEqual(8);

      const example = output.get(TalentsEnum.Boat);
      expect(example).toBeTruthy();
      expect(example?.next?.key).toEqual(TalentsEnum.Scuba);
    });
  });
  describe("buildActive()", () => {
    it("normal case", () => {
      const configuration = clonedeep(model);
      const talents = UnderTest.buildTalents(configuration);
      
      const output = UnderTest.buildActive(configuration, talents);

      const keys = [...output.keys()];
      expect(keys.length).toEqual(3);

      configuration.activeTalents.forEach(t => {
        expect(output.get(t)).toBeTruthy();
      })
    });
  });
  describe("buildEnabled()", () => {
    it("normal case", () => {
      const configuration = clonedeep(model);
      const talents = UnderTest.buildTalents(configuration);
      const active = UnderTest.buildActive(configuration, talents);
      
      const output = UnderTest.buildEnabled(configuration, talents, active);

      const keys = [...output.keys()];
      expect(keys.length).toEqual(5);
    });
    it("no active talents at start", () => {
      const configuration = clonedeep(model);
      configuration.activeTalents = [];
      const talents = UnderTest.buildTalents(configuration);
      const active = UnderTest.buildActive(configuration, talents);
      
      const output = UnderTest.buildEnabled(configuration, talents, active);

      const keys = [...output.keys()];
      expect(keys.length).toEqual(2);
    });
  });
});