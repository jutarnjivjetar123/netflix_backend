"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabaseConnection = exports.DatabaseConnection = void 0;
const typeorm_1 = require("typeorm");
const user_model_1 = __importDefault(require("../models/user.model/user.model"));
const password_model_1 = __importDefault(require("../models/user.model/password.model"));
const email_model_1 = __importDefault(require("../models/user.model/email.model"));
const salt_model_1 = __importDefault(require("../models/user.model/salt.model"));
const verificationToken_model_1 = __importDefault(require("../models/user.model/verificationToken.model"));
const session_model_1 = __importDefault(require("../models/user.model/session.model"));
const phone_model_1 = __importDefault(require("../models/user.model/phone.model"));
exports.DatabaseConnection = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "SuperAdmin",
    password: "1234",
    database: "netflix_clone",
    entities: [
        user_model_1.default,
        password_model_1.default,
        email_model_1.default,
        salt_model_1.default,
        verificationToken_model_1.default,
        session_model_1.default,
        phone_model_1.default,
    ],
    logging: false,
    synchronize: true,
    subscribers: [],
    migrations: [],
    uuidExtension: "uuid-ossp",
});
const initializeDatabaseConnection = async () => {
    try {
        await exports.DatabaseConnection.initialize();
        console.log(new Date() +
            " -> LOG::Success::DatabaseConnection::initializeDatabaseConnection::Database connection initialized");
    }
    catch (error) {
        console.log(new Date() +
            " -> LOG::Error::DatabaseConnection::initializeDatabaseConnection::Database connection initialization failed");
        console.log(error);
    }
};
exports.initializeDatabaseConnection = initializeDatabaseConnection;
//# sourceMappingURL=config.database.js.map