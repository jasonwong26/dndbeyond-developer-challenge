import * as express from "express";
import * as dotenv from "dotenv";
import * as colors from "colors";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

//Define port
const port = parseInt(process.env.PORT || "");

//Define request response in root URL (/)
const app = express();
app.get("/", function (_, res) {
  res.send("Hello World!");
});

//Launch listening server on port 3000
app.listen(port, function () {
  console.log(colors.green(`app listening on port ${port}!`));
});
