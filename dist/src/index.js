"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const config_database_1 = require("./database/config.database");
const user_routes_1 = __importDefault(require("./routes/user/user.routes"));
const test_routes_1 = __importDefault(require("../src/routes/test/test.routes"));
const app = (0, express_1.default)();
const port = process.env.DEFAULT_PORT || 3000;
const startDatabaseConnection = async () => {
    await (0, config_database_1.initializeDatabaseConnection)();
};
startDatabaseConnection();
app.use(express_1.default.json());
app.use("/user", user_routes_1.default);
app.use("/dev", test_routes_1.default);
app.get("/checkStatus", (req, res) => {
    return res.status(200).send({
        successState: true,
        message: "API is available to use",
        timestamp: new Date(),
    });
});
app.get("/dev/database/setup", (req, res) => {
    config_database_1.DatabaseConnection.initialize()
        .then(() => {
        return res.status(200).send({
            successState: true,
            message: "Database is online",
            timestamp: new Date(),
        });
    })
        .catch((err) => {
        return res.status(200).send({
            successState: true,
            message: "Database not setup, error: " + err,
            timestamp: new Date(),
        });
    });
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
//# sourceMappingURL=index.js.map