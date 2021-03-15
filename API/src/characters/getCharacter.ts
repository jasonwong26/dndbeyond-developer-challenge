import debug from "debug";
import * as Types from "../types";
import { respondNotFound } from "../shared";

const log = debug("characters/getCharacter");
export const getCharacter: Types.InjectedHandler = (service) => async (request, response, next) => {
  try {
    const key = request.params.characterId;
    const character = await service.fetch<Types.Character>(key);

    if (!character) {
      respondNotFound(response);
      return;
    }

    response.json(character);
  }
  catch (error) {
    log("error", error);
    next(error)
  }
}
