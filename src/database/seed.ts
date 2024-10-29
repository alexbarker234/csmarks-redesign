import fs from "fs";
import sqlite3 from "sqlite3";
import { randBetween } from "../utils/random";
const dbPath = "./public/mock.sqlite";

const createTables = (db: sqlite3.Database) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Unit (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Enrollment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      unitId TEXT,
      userId INTEGER,
      FOREIGN KEY (userId) REFERENCES User(id),
      FOREIGN KEY (unitId) REFERENCES Unit(id)
    );

    CREATE TABLE IF NOT EXISTS Assessment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      unitId TEXT,
      maxMark INTEGER NOT NULL,
      resultsReleased BOOLEAN NOT NULL CHECK (resultsReleased IN (0, 1)),
      FOREIGN KEY (unitId) REFERENCES Unit(id)
    );

    CREATE TABLE IF NOT EXISTS Result (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      assessmentId INTEGER,
      mark INTEGER,
      FOREIGN KEY (userId) REFERENCES User(id),
      FOREIGN KEY (assessmentId) REFERENCES Assessment(id)
    );
  `);
};

const assessmentSets = [
  ["Lab Quiz 1", "Lab Quiz 2", "Lab Quiz 3", "Project 1", "Project 2"],
  ["Midterm Exam", "Final Exam", "Project 1", "Project 2"],
  ["Lab Quiz 1", "Report 1", "Lab Quiz 2", "Report 2", "Lab Quiz 3", "Report 3"]
];

const seedData = (db: sqlite3.Database) => {
  const users = [
    { id: 23152009, firstName: "Alex", lastName: "Barker" },
    { id: 22847284, firstName: "Jane", lastName: "Smith" },
    { id: 28375637, firstName: "Bob", lastName: "Johnson" }
  ];

  const units = [
    { id: "CITS2006", name: "Defensive Cybersecurity" },
    { id: "CITS3006", name: "Penetration Testing" },
    { id: "CITS3200", name: "Professional Computing" }
  ];

  // Enrol each user into a random 2 units
  const numUnits = 2;
  const enrollments = [];
  for (const user of users) {
    const unitIds = units
      .map((unit) => unit.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, numUnits);

    for (const unitId of unitIds) {
      enrollments.push({ unitId, userId: user.id });
    }
  }

  // For each unit, choose an assessment set and release a random number of assessments
  const markOptions = [20, 40, 60, 80, 100];

  const assessments: {
    id: number;
    name: string;
    unitId: string;
    maxMark: number;
    resultsReleased: boolean;
  }[] = [];
  for (const unit of units) {
    const assessmentSet =
      assessmentSets[Math.floor(Math.random() * assessmentSets.length)];
    for (const assessmentName of assessmentSet) {
      const assessment = assessments.find((a) => a.name === assessmentName);
      if (!assessment) {
        const maxMark =
          markOptions[Math.floor(Math.random() * markOptions.length)];
        const resultsReleased = Math.random() > 0.5;
        assessments.push({
          id: assessments.length + 1,
          name: assessmentName,
          unitId: unit.id,
          maxMark,
          resultsReleased
        });
      }
    }
  }

  // Generate random marks for each user in their enrolled units
  const results: {
    userId: number;
    assessmentId: number;
    mark: number | null;
  }[] = [];
  for (const enrollment of enrollments) {
    const { userId, unitId } = enrollment;

    // Find assessments for the user's enrolled unit
    const unitAssessments = assessments.filter(
      (assessment) => assessment.unitId === unitId
    );

    for (const assessment of unitAssessments) {
      const mark = assessment.resultsReleased
        ? Math.floor(randBetween(0, assessment.maxMark))
        : null;
      results.push({
        userId,
        assessmentId: assessment.id,
        mark
      });
    }
  }

  // Insert data
  for (const user of users) {
    db.run(
      `INSERT INTO User (id, firstName, lastName) VALUES (?, ?, ?)`,
      user.id,
      user.firstName,
      user.lastName
    );
  }

  for (const unit of units) {
    db.run(`INSERT INTO Unit (id, name) VALUES (?, ?)`, unit.id, unit.name);
  }
  for (const enrollment of enrollments) {
    db.run(
      `INSERT INTO Enrollment (unitId, userId) VALUES (?, ?)`,
      enrollment.unitId,
      enrollment.userId
    );
  }

  for (const assessment of assessments) {
    db.run(
      `INSERT INTO Assessment (id, name, unitId, maxMark, resultsReleased) VALUES (?, ?, ?, ?, ?)`,
      assessment.id,
      assessment.name,
      assessment.unitId,
      assessment.maxMark,
      assessment.resultsReleased ? 1 : 0
    );
  }

  for (const result of results) {
    db.run(
      `INSERT INTO Result (userId, assessmentId, mark) VALUES (?, ?, ?)`,
      result.userId,
      result.assessmentId,
      result.mark
    );
  }
};

async function seedDatabase() {
  // Delete old file
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log("Old database file deleted");
  }
  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    createTables(db);
    seedData(db);
  });

  console.log("Database initialized and seeded successfully.");
  await db.close();
}

seedDatabase().catch((error) => {
  console.error("Error initializing the database:", error);
});
