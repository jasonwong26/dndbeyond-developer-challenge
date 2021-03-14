import shortid from "shortid";
import * as Types from "../shared";
import { calculateFixedHp, parseExact } from "../utility";

export const createCharacter: Types.InjectedHandler = (service) => async (request, response, next) => {
  try {
    console.log("input", {input: request.body});

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
    console.log(error);
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
