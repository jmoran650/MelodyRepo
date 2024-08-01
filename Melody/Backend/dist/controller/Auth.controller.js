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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const dataSource_1 = require("../dataSource");
const User_entity_1 = require("../entity/User.entity");
const helpers_1 = require("../helpers/helpers");
class AuthController {
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    return res
                        .status(500)
                        .json({ message: " email and password required" });
                }
                const userRepository = dataSource_1.MelodyDataSource.getRepository(User_entity_1.User);
                const user = yield userRepository.findOne({ where: { email } });
                const isPasswordValid = helpers_1.encrypt.comparepassword(user.password, password);
                if (!user || !isPasswordValid) {
                    return res.status(404).json({ message: "User not found" });
                }
                const token = helpers_1.encrypt.generateToken({ id: user.id, role: user.role });
                return res.status(200).json({ message: "Login successful", user, token });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.currentUser) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const userRepository = dataSource_1.MelodyDataSource.getRepository(User_entity_1.User);
            const user = yield userRepository.findOne({
                where: { id: req.currentUser.id },
            });
            return res.status(200).json(Object.assign(Object.assign({}, user), { password: undefined }));
        });
    }
}
exports.AuthController = AuthController;
