import * as Types from "../shared";

export const notFound: Types.Handler = (_, response) => {
  response.send("notFound");
}
