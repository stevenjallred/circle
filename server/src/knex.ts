import pg from "pg";
import Knex from "knex";
import knexfile from "../knexfile";
import inf from "inflection";
import mapObject from "map-obj";

pg.types.setTypeParser(20, "text", Number);

const knexHelpers = {
  wrapIdentifier: (value: string, origImpl: any) =>
    origImpl(inf.underscore(value, false)),
  postProcessResponse: (result: any) => {
    return mapObject(
      result,
      (key, value) => [inf.camelize(String(key), true), value],
      { deep: true }
    );
  },
};

export const knex = Knex({ ...knexfile.development, ...knexHelpers });
