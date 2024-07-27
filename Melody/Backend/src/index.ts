import { DataSource } from "typeorm"
import { User } from "./entity/User"

const myDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "MelodyAdmin",
    password: "MelodyZaza1234",
    database: "Melody-DataBase",
    entities: ["entity/*.ts"],
})