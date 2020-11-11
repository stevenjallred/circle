import pg from "pg";
import Knex from "knex";
import knexfile from "../knexfile";

pg.types.setTypeParser(20, "text", Number);

export const knex = Knex(knexfile.development);
