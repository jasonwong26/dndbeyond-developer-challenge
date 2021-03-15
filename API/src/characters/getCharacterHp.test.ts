import * as sinon from "sinon";
import * as Types from "../types";
import {DataService, InMemoryDataService } from "../utility"
import { getCharacterHp } from "./getCharacterHp";
import { mockReq, mockRes } from "sinon-express-mock";

describe("getCharacterHp()", () => {
  // base model used for testing
  const model: Types.Character = {
    id: "test",
    hp: 31,
    maxHp: 31,
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
    }
  };
 
  let service: DataService;
  let next: sinon.SinonSpy;
  beforeEach(() => {
    service = new InMemoryDataService();
    next = sinon.spy();
  });
  it("200", async () => {
    await service.save(model.id, model);

    const request = mockReq();
    const response = mockRes();
    request.params["characterId"] = model.id;

    await getCharacterHp(service)(request, response, next);

    expect(!response.status.called || response.status.calledWith(200)).toBeTruthy();
  });
  it("404", async () => {
    const request = mockReq();
    const response = mockRes();
    request.params["characterId"] = model.id;

    await getCharacterHp(service)(request, response, next);

    expect(response.status.calledWith(404)).toBeTruthy();
  });
  it("500", async () => {
    const request = mockReq();
    const response = mockRes();
    request.params["characterId"] = model.id;

    await getCharacterHp(null as unknown as DataService)(request, response, next);

    expect(next.called).toBeTruthy();
  });
});