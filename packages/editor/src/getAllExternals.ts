import {
  CompilationContextType,
  configTraverse,
  isExternalSchemaProp,
  isTrulyResponsiveValue,
} from "@easyblocks/app-utils";
import { ConfigComponent, UnresolvedResource } from "@easyblocks/core";

type ExternalValueWithPositionInConfig = {
  type: string;
  path: string;
  value: UnresolvedResource;
};

export function getAllExternals(
  config: ConfigComponent,
  context: CompilationContextType
): ExternalValueWithPositionInConfig[] {
  const result: ExternalValueWithPositionInConfig[] = [];

  configTraverse(config, context, ({ schemaProp, path, value }) => {
    if (isExternalSchemaProp(schemaProp)) {
      if (isTrulyResponsiveValue(value)) {
        for (const key in value) {
          if (key === "$res") {
            continue;
          }

          if (!value[key].id) {
            continue;
          }

          result.push({
            type: schemaProp.type,
            value: { ...value[key] },
            path: path + "." + key,
          });
        }
      } else {
        result.push({
          type: schemaProp.type,
          value: { ...value },
          path: path,
        });
      }
    }
  });

  return result;
}
