import debug from "debug";
import * as Types from "../types";
import * as Map from "../mapping";
import { calculateNewTempHp } from "../business"
import { parseExact } from "../utility";

const log = debug("characters/setCharacterHp");
export const setCharacterTempHp: Types.InjectedHandler = (service) => async (request, response, next) => {
  try {
    // validate input model
    const input = parseExact(Types.SetTempHpRequestModel, request.body);

    const key = request.params.characterId;
    const character = await service.fetch<Types.Character>(key);

    if (!character) {
      const output: Types.ApiResponse = {
        message: "not found"
      }
      response.status(404).json(output);
      return;
    }

    // calculate & set updated hp totals
    const change = input.override 
      ? input.value 
      : calculateNewTempHp(character, input.value);
    character.tempHp = change;

    await service.save(key, character);

    // map to output model
    const hp = Map.toCharacterHp(character);
    response.json(hp);
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
