import initSqlJs, { Database, QueryExecResult } from "sql.js";
import { Assessment, User } from "../types";

let dbInstance: Database | null = null;

async function initDB(dbFile: string = "/mock.sqlite"): Promise<Database> {
  if (!dbInstance) {
    console.log("Initialising Mock DB");

    const SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`
    });

    const response = await fetch(dbFile);
    const buffer = await response.arrayBuffer();
    dbInstance = new SQL.Database(new Uint8Array(buffer));

    console.log("Mock DB initialised");
  }
  return dbInstance;
}

// Fetch a User by ID
export async function fetchUser(userId: number): Promise<User | null> {
  const db = await initDB();
  const result: QueryExecResult[] = db.exec(
    `SELECT id, firstName, lastName FROM User WHERE id = ?`,
    [userId]
  );
  if (result.length > 0 && result[0].values.length > 0) {
    const row = result[0].values[0];
    return {
      id: row[0] as number,
      firstName: row[1] as string,
      lastName: row[2] as string
    };
  }
  return null;
}

// Fetch a User's Enrolled Units
export async function fetchUserEnrolledUnits(
  userId: number
): Promise<{ unitId: string; name: string }[]> {
  const db = await initDB();
  const result: QueryExecResult[] = db.exec(
    `
    SELECT Unit.id, Unit.name 
    FROM Unit 
    JOIN Enrolment ON Unit.id = Enrolment.unitId 
    WHERE Enrolment.userId = ?
  `,
    [userId]
  );

  return result.length > 0
    ? result[0].values.map((row) => ({
        unitId: row[0] as string,
        name: row[1] as string
      }))
    : [];
}

// Fetch a User's Assessments Across All Units
export async function fetchUserAssessments(
  userId: number
): Promise<{ assessmentId: number; name: string; mark: number | null }[]> {
  const db = await initDB();
  const result: QueryExecResult[] = db.exec(
    `
    SELECT Assessment.id, Assessment.name, Result.mark
    FROM Assessment
    LEFT JOIN Result ON Assessment.id = Result.assessmentId AND Result.userId = ?
  `,
    [userId]
  );

  return result.length > 0
    ? result[0].values.map((row) => ({
        assessmentId: row[0] as number,
        name: row[1] as string,
        mark: row[2] as number | null
      }))
    : [];
}

// Fetch a User's Assessments for a Specific Unit
export async function fetchUserAssessmentsForUnit(
  userId: number,
  unitId: string
): Promise<Assessment[]> {
  const db = await initDB();
  const result: QueryExecResult[] = db.exec(
    `
    SELECT Assessment.name, Result.mark, Assessment.maxMark
    FROM Assessment
    LEFT JOIN Result ON Assessment.id = Result.assessmentId AND Result.userId = ?
    WHERE Assessment.unitId = ?
  `,
    [userId, unitId]
  );

  return result.length > 0
    ? result[0].values.map((row) => ({
        name: row[0] as string,
        mark: row[1] !== null ? (row[1] as number) : undefined,
        maxMark: row[2] as number
      }))
    : [];
}

// Fetch All Assessments for a Specific Unit
export async function fetchUnitAssessments(unitId: string): Promise<
  {
    assessmentId: number;
    name: string;
    maxMark: number;
    resultsReleased: boolean;
  }[]
> {
  const db = await initDB();
  const result: QueryExecResult[] = db.exec(
    `
    SELECT id, name, maxMark, resultsReleased 
    FROM Assessment 
    WHERE unitId = ?
  `,
    [unitId]
  );

  return result.length > 0
    ? result[0].values.map((row) => ({
        assessmentId: row[0] as number,
        name: row[1] as string,
        maxMark: row[2] as number,
        resultsReleased: Boolean(row[3])
      }))
    : [];
}
