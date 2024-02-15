import { Pool, PoolClient } from "pg";

export let pool: Pool;

export const connectToDatabase = async () => {
  try {
    const poolInstance = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });

    await poolInstance.query("SELECT NOW()");

    pool = poolInstance;

    console.log("PostgreSQL connected");
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
  }
};

export async function executeQuery<T>(
  queryText: string,
  values: unknown[] = [],
  client?: PoolClient
): Promise<QueryResult<T>> {
  try {
    const result = await (client ?? pool).query(queryText, values);

    return result as QueryResult<T>;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}

type QueryResult<T> = {
  rows: T[];
  rowCount: number;
};
