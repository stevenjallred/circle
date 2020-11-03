const pg = require("pg");
const Knex = require("knex");
const knexfile = require("./knexfile");

pg.types.setTypeParser(20, "text", Number);

const knex = Knex(knexfile.development);

module.exports = { knex };
