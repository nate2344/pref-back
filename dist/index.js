"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const Router_1 = __importDefault(require("./routes/Router"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = require("dotenv");
const database_1 = require("./config/database");
const main = async () => {
    (0, dotenv_1.config)();
    const app = (0, express_1.default)();
    const port = Number(process.env.PORT);
    const routes = Router_1.default;
    (0, database_1.connectToDatabase)();
    app.use(body_parser_1.default.json({ limit: "10mb" }));
    app.use(body_parser_1.default.urlencoded({ limit: "10mb", extended: true }));
    app.use(express_1.default.json());
    app.use((0, cors_1.default)({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    }));
    app.use("/api", routes);
    app.listen(port, "10.148.9.5", () => {
        console.log(`Servidor online!`);
    });
};
main();
