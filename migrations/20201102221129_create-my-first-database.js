/**
 * @param {import('knex')} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable("users", (t) => {
    t.bigIncrements("id").primary();
    t.text("name").notNullable();
  });

  await knex.schema.createTable("posts", (t) => {
    t.bigIncrements("id").primary();
    t.text("body").notNullable();
    t.bigInteger("userId").notNullable().references("id").inTable("users");
  });
};

/**
 * @param {import('knex')} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("posts");
  await knex.schema.dropTable("users");
};
