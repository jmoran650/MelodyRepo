import { DataSource } from "typeorm"
export const AppDataSource = new DataSource({
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
})