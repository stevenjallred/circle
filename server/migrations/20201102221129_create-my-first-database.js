/**
 * @param {import('knex')} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable("users", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.text("name").notNullable();
    t.text("avatar_url");
    t.timestamps(true, true);
  });

  await knex.schema.createTable("passwords", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.text("pw").notNullable();
    t.uuid("user_id").notNullable().references("id").inTable("users").unique();
    t.timestamps(true, true);
  });

  await knex.schema.createTable("objects", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.text("body").notNullable();
    t.uuid("user_id").notNullable().references("id").inTable("users");
    t.timestamps(true, true);
  });
};

/**
 * @param {import('knex')} knex
 */
exports.down = async function (knex) {};
