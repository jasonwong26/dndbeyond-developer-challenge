import shortid from "shortid";
import debug from "debug";
import * as Types from "../types";
import { calculateFixedHp } from "../business"
import { parseExact } from "../utility";

const log = debug("characters/createCharacter");
export const createCharacter: Types.InjectedHandler = (service) => async (request, response, next) => {
  try {
    log("input", { input: request.body });

    // validate input model
    const input = parseExact(Types.CreateCharacterRequestModel, request.body);
    // {placeholder for additional data integrity validations}
    // - level == sum of class levels
    // - class level > 0
    // - attributes > 0

    // map to character
    const key = shortid.generate();
    const hp = calculateFixedHp(input);
    const character: Types.Character = { id: key, hp, maxHp: hp, tempHp: 0, ...input };
    await service.save(key, character);

    response.json(character);
  }
  catch (error) {
    log("error", error);
    if (error.name === "ValidationError") {
      const output: Types.ApiResponse = {
        message: `Bad Request. ${error.message}`
      }
      response.status(400).json(output);
      return;
    }

    next(error)
  }
}
