import * as sinon from "sinon";
import * as Types from "../types";
import {DataService, InMemoryDataService } from "../utility"
import { createCharacter } from "./createCharacter";
import { mockReq, mockRes } from "sinon-express-mock";

describe("createCharacter()", () => {
  // base model used for testing
  const model: Types.CreateCharacterRequest = {
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
    const request = mockReq({ body: model });
    const response = mockRes();

    await createCharacter(service)(request, response, next);

    expect(!response.status.called || response.status.calledWith(200)).toBeTruthy();
  });
  it("400", async () => {
    const { name, level } = model;
    const body = { name, level };
    const request = mockReq({ body });
    const response = mockRes();

    await createCharacter(service)(request, response, next);

    expect(response.status.calledWith(400)).toBeTruthy();
  });
  it("500", async () => {
    const request = mockReq({ body: model });
    const response = mockRes();

    createCharacter(null as unknown as DataService)(request, response, next);

    expect(next.called).toBeTruthy();
  });
});