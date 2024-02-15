"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeQuery = exports.connectToDatabase = exports.pool = void 0;
const pg_1 = require("pg");
const connectToDatabase = async () => {
    try {
        const poolInstance = new pg_1.Pool({
            connectionString: process.env.POSTGRES_URL,
        });
        await poolInstance.query("SELECT NOW()");
        exports.pool = poolInstance;
        console.log("PostgreSQL connected");
    }
    catch (error) {
        console.error("Error connecting to PostgreSQL:", error);
    }
};
exports.connectToDatabase = connectToDatabase;
async function executeQuery(queryText, values = [], client) {
    try {
        const result = await (client ?? exports.pool).query(queryText, values);
        return result;
    }
    catch (error) {
        console.error("Error executing query:", error);
        throw error;
    }
}
exports.executeQuery = executeQuery;
