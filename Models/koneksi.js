const knex = require("knex")({
  client: "mysql",
  version: "5.7",
  connection: {
    host: "sql6.freemysqlhosting.net",
    user: "sql6408843",
    password: "PkN1IKbiJh",
    database: "sql6408843",
  },
});
module.exports = knex;
