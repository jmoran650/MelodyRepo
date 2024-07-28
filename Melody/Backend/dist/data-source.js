"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "MelodyAdmin",
    password: "MelodyZaza1234",
    database: "Melody-DataBase",
    synchronize: true,
    logging: true,
    entities: ["src/entity/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
});
