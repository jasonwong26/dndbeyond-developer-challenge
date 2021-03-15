import * as Types from "../types";

export const notFound: Types.Handler = (_, response) => {
  response.send("notFound");
}
