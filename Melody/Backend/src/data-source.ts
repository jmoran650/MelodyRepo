import "reflect-metadata"
import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from "typeorm"
import { User } from "./entity/User.entity"

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);
console.log("DB_DATABASE:", process.env.DB_DATABASE);

export const MelodyDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: true,
    entities: [User],
})


