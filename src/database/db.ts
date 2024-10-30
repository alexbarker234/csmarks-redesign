import { drizzle } from "drizzle-orm/sql-js";
import initSqlJs from "sql.js";

let db: ReturnType<typeof drizzle>;

export const initDB = async (dbFile: string = "/mock.sqlite") => {
  if (!db) {
    console.log("Initialising Mock DB");

    // Load SQL.js
    const SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`
    });

    // Fetch the SQLite database file from the server
    const response = await fetch(dbFile);
    const buffer = await response.arrayBuffer();
    const sqlJsDb = new SQL.Database(new Uint8Array(buffer));

    // Init Drizzle ORM with the fetched database
    db = drizzle(sqlJsDb);

    console.log("Mock DB initialised");
  }

  return db;
};

export const getDb = () => {
  if (!db) throw new Error("Database has not been initialized.");
  return db;
};
