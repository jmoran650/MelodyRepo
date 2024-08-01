
import { DataSource } from "typeorm"
import { User } from "./entity/User.entity"
import * as dotenv from "dotenv";
dotenv.config();


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
