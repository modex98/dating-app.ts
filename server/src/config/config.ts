import dotenv from "dotenv";
dotenv.config();
import path from "path";

export const APP_PATH = path.dirname(__dirname);

const MONGO_HOST = process.env.MONGO_HOST || "cluster0.jp8ac.mongodb.net";
const MONGO_USERNAME = process.env.MONGO_USERNAME || "modex987";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "mongo1998";
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "dating-app";

const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
const REDIS_USERNAME = process.env.REDIS_USERNAME || "modex98";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "mongo1998";

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = Number(process.env.SERVER_PORT) || 3000;

const CLIENT_HOSTNAME = process.env.CLIENT_HOSTNAME || "localhost";
const CLIENT_PORT = Number(process.env.CLIENT_PORT) || 8080;

export const MAX_USER_PHOTOS = Number(process.env.MAX_USER_PHOTOS) || 13;

export const JWT_SECRET_ACCESS = process.env.JWT_SECRET_ACCESS!;
export const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH!;

export const JWT_SECRET = {
      access: JWT_SECRET_ACCESS,
      refresh: JWT_SECRET_REFRESH,
};

export const REDIS = {
      host: REDIS_HOST,
      port: REDIS_PORT,
      username: REDIS_USERNAME,
      password: REDIS_PASSWORD,
};

export const MONGO = {
      host: MONGO_HOST,
      username: MONGO_USERNAME,
      password: MONGO_PASSWORD,
      db_name: MONGO_DB_NAME,
      uri: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DB_NAME}?retryWrites=true&w=majority`,
};

export const SERVER = {
      hostname: SERVER_HOSTNAME,
      port: SERVER_PORT,
};

export const CLIENT = {
      hostname: CLIENT_HOSTNAME,
      port: CLIENT_PORT,
};

export const SMTP = {
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
            user: "f774c5db2b92ae",
            pass: "5013ead5d34552",
      },
};
