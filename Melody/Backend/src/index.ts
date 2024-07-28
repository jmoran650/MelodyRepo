import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";


const myDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "MelodyAdmin",
    password: "MelodyZaza1234",
    database: "Melody-DataBase",
    synchronize: true,
    logging: true,
    entities: [User],
})

myDataSource.initialize()
    .then(async () => {
        console.log("Data Source has been initialized!");

        // Demonstrate connection by performing a simple insert and query
        try {

    
            const app = express();
            app.use(cors());
            app.use(bodyParser.json());

            const userRepository = myDataSource.getRepository(User);

            // Insert a new user
            const newUser = new User();

            newUser.id = 123456
            newUser.name = "John";
            newUser.email = "john@email.com";
            await userRepository.save(newUser);
            console.log("New user has been saved:", newUser);

            // Fetch all users
            const users = await userRepository.find();

                    // Endpoint to get all users
        app.get("/users", async (req, res) => {
            try {
                const users = await userRepository.find();
                res.json(users);
            } catch (error) {
                console.error("Error fetching users:", error);
                res.status(500).send("Internal Server Error");
            }
        });

        // Endpoint to add a new user
        app.post("/users", async (req, res) => {
            try {
                const newUser = userRepository.create(req.body);
                const result = await userRepository.save(newUser);
                res.json(result);
            } catch (error) {
                console.error("Error saving user:", error);
                res.status(500).send("Internal Server Error");
            }
        });

        const port = 3000;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });


        } catch (error) {
            console.error("Error during database operations:", error);
        }
    })
    .catch((error) => console.log(error))