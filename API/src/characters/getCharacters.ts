import * as Types from "../shared";
import { respondNoContent } from "../errors";

export const getCharacters: Types.InjectedHandler = (service) => async (request, response, next) => {
  try {
    const characters = await service.list<Types.Character>()
      .then(l => l.sort((a, b) => {
        const aKey = `${a.name}${a.id}`;
        const bKey = `${b.name}${b.id}`;
        if(aKey < bKey) return -1;
        if(aKey > bKey) return 1;
        return 0;
      }));

    if (!characters?.length) {
      respondNoContent(response);
      return;
    }

    response.json(characters);
  }
  catch (error) {
    console.log(error);
    next(error)
  }
}
