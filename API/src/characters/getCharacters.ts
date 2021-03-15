import debug from "debug";
import * as Types from "../types";
import { respondNoContent } from "../shared";

const log = debug("characters/getCharacters");
export const getCharacters: Types.InjectedHandler = (service) => async (_, response, next) => {
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
    log("error", error);
    next(error)
  }
}
