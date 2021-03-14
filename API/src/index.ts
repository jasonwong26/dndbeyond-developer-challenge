import dotenv from "dotenv";
import colors from "colors";
import { buildApp } from "./app";

let port = 3000;
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
  port = parseInt(process.env.PORT || `${port}`);
}

//Construct and launch
const app = buildApp();
app.listen(port, function () {
  console.log(colors.green(`app listening on port ${port}! \r\nbrowse at: http://localhost:${port}/`));
});
