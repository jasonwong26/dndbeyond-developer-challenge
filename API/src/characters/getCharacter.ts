import * as Types from "../shared";
import { respondNotFound } from "../errors";

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
    console.log(error);
    next(error)
  }
}
