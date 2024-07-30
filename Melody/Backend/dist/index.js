"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const myDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "MelodyAdmin",
    password: "MelodyZaza1234",
    database: "Melody-DataBase",
    synchronize: true,
    logging: true,
    entities: [User_1.User],
});
myDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Data Source has been initialized!");
    // Demonstrate connection by performing a simple insert and query
    try {
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)());
        app.use(body_parser_1.default.json());
        const userRepository = myDataSource.getRepository(User_1.User);
        // Insert a new user
        const newUser = new User_1.User();
        newUser.userId = '123456';
        newUser.userName = "John";
        newUser.userEmail = "john@email.com";
        yield userRepository.save(newUser);
        console.log("New user has been saved:", newUser);
        // Fetch all users
        const users = yield userRepository.find();
        // Endpoint to get all users
        app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const users = yield userRepository.find();
                res.json(users);
            }
            catch (error) {
                console.error("Error fetching users:", error);
                res.status(500).send("Internal Server Error");
            }
        }));
        // Endpoint to add a new user
        app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const newUser = userRepository.create(req.body);
                const result = yield userRepository.save(newUser);
                res.json(result);
            }
            catch (error) {
                console.error("Error saving user:", error);
                res.status(500).send("Internal Server Error");
            }
        }));
        const port = 3000;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
    catch (error) {
        console.error("Error during database operations:", error);
    }
}))
    .catch((error) => console.log(error));
