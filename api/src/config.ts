require("dotenv").config();

const config = {
  // # A P P
  NODE_ENV: process.env.NODE_ENV,
  APP_PORT: process.env.APP_PORT,
  JWT_SECRET: process.env.JWT_SECRET,

  // # D A T A B A S E
  DATABASE_URL: process.env.DATABASE_URL,
};

export default config;
