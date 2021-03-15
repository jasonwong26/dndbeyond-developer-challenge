import debug from "debug";
import * as Types from "../types";
import * as Map from "../mapping";
import { respondNotFound } from "../shared";

const log = debug("characters/getCharacterHp");
export const getCharacterHp: Types.InjectedHandler = (service) => async (request, response, next) => {
  try {
    const key = request.params.characterId;
    const character = await service.fetch<Types.Character>(key);

    if (!character) {
      respondNotFound(response);
      return;
    }

    const hp = Map.toCharacterHp(character);

    response.json(hp);
  }
  catch (error) {
    log("error", error);
    next(error)
  }
}
