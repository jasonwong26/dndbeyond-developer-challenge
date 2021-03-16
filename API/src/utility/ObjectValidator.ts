import * as ts from "io-ts";
import * as Types from "../types";
import { pipe } from "fp-ts/lib/pipeable"
import { left } from "fp-ts/lib/Either";
import { fold } from "fp-ts/lib/Either"
import { PathReporter } from "io-ts/lib/PathReporter";

export const parseExact = <TsModel extends ts.HasProps>(model: TsModel, input: unknown): ts.TypeOf<TsModel> => {
  const exactValidation = ts.exact(model);
  const result = exactValidation.decode(input);
  const onError = (errors: ts.Errors) => {
    const errorReport = PathReporter.report(left(errors)).join("\n");
    throw new Types.ValidationError("Input does not match expected model.", errorReport);
  }
  const onSuccess = (output: TsModel) => {
    return output;
  }
  return pipe(result, fold(onError, onSuccess)) as ts.TypeOf<typeof model>;
}