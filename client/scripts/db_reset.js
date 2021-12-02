#!/usr/bin/env node

const { Client } = require("pg");

const client = new Client({
  user: "poc",
  database: "poc_dev",
  password: "password",
});

const deleteAll = async () => {
  await client.connect();
  await client.query("DELETE FROM address_listings");
  await client.query("DELETE FROM addresses");
  await client.query("DELETE FROM lists");
  await client.end();
  console.log("DB was reset.");
};

deleteAll();
