import * as Types from "../shared";
import * as Map from "../mapping";
import { respondNotFound } from "../errors";

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
    console.log(error);
    next(error)
  }
}
