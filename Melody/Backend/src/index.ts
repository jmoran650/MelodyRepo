


import express from "express";
import bodyParser from "body-parser";
import cors from "cors";


import { MelodyDataSource } from "./data-source";


    MelodyDataSource.initialize()
    .then(async () => {
        console.log("Data Source has been initialized!");

        // Demonstrate connection by performing a simple insert and query
        try {

    
            const app = express();
            app.use(cors());
            app.use(express.json());
            app.use(bodyParser.json());

        const port = 3000;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });


        } catch (error) {
            console.error("Error during database operations:", error);
        }
    })
    .catch((error) => console.log(error))