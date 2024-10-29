import fs from "fs";
import sqlite3 from "sqlite3";
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

const seedData = (db: sqlite3.Database) => {
  const users = [
    { id: 23347863, firstName: "John", lastName: "Doe" },
    { id: 22847284, firstName: "Jane", lastName: "Smith" },
    { id: 28375637, firstName: "Bob", lastName: "Johnson" }
  ];

  const units = [
    { id: "CITS2006", name: "Defensive Cybersecurity" },
    { id: "CITS3006", name: "Penetration Testing" },
    { id: "CITS3200", name: "Professional Computing" }
  ];

  const enrollments = [
    { unitId: "CITS2006", userId: 23347863 },
    { unitId: "CITS2006", userId: 22847284 },
    { unitId: "CITS2006", userId: 28375637 },

    { unitId: "CITS3006", userId: 23347863 },
    { unitId: "CITS3006", userId: 22847284 },
    { unitId: "CITS3006", userId: 28375637 },

    { unitId: "CITS3200", userId: 23347863 },
    { unitId: "CITS3200", userId: 22847284 },
    { unitId: "CITS3200", userId: 28375637 }
  ];

  const assessments = [
    {
      id: 1,
      name: "Lab Quiz 1",
      unitId: 1,
      maxMark: 100,
      resultsReleased: true
    },
    {
      id: 2,
      name: "Lab Quiz 2",
      unitId: 1,
      maxMark: 100,
      resultsReleased: true
    },
    {
      id: 3,
      name: "Midterm Exam",
      unitId: 1,
      maxMark: 100,
      resultsReleased: true
    },
    {
      id: 4,
      name: "Final Exam",
      unitId: 1,
      maxMark: 100,
      resultsReleased: true
    },

    {
      id: 5,
      name: "Lab Quiz 1",
      unitId: 2,
      maxMark: 100,
      resultsReleased: true
    },
    {
      id: 6,
      name: "Midterm Exam",
      unitId: 2,
      maxMark: 100,
      resultsReleased: true
    },
    {
      id: 7,
      name: "Lab Quiz 2",
      unitId: 2,
      maxMark: 100,
      resultsReleased: false
    },
    {
      id: 8,
      name: "Final Project",
      unitId: 2,
      maxMark: 100,
      resultsReleased: false
    },

    {
      id: 9,
      name: "Group Project 1",
      unitId: 3,
      maxMark: 10,
      resultsReleased: true
    },
    {
      id: 10,
      name: "Reflections",
      unitId: 3,
      maxMark: 10,
      resultsReleased: true
    },
    { id: 11, name: "Sprint 1", unitId: 3, maxMark: 22, resultsReleased: true },
    { id: 12, name: "Sprint 2", unitId: 3, maxMark: 20, resultsReleased: true },
    {
      id: 13,
      name: "Final Report",
      unitId: 3,
      maxMark: 20,
      resultsReleased: true
    },
    {
      id: 14,
      name: "Presentation",
      unitId: 3,
      maxMark: 5,
      resultsReleased: true
    }
  ];

  const results = [
    // Defensive Cybersecurity scores
    { userId: 23347863, assessmentId: 1, mark: 71 },
    { userId: 23347863, assessmentId: 2, mark: 98 },
    { userId: 23347863, assessmentId: 3, mark: 74 },
    { userId: 23347863, assessmentId: 4, mark: 90 },

    // Penetration Testing scores
    { userId: 23347863, assessmentId: 5, mark: 81 },
    { userId: 23347863, assessmentId: 6, mark: 78 },
    { userId: 23347863, assessmentId: 7, mark: undefined },
    { userId: 23347863, assessmentId: 8, mark: undefined },

    // Professional Computing scores
    { userId: 23347863, assessmentId: 9, mark: 6 },
    { userId: 23347863, assessmentId: 10, mark: 3 },
    { userId: 23347863, assessmentId: 11, mark: 22 },
    { userId: 23347863, assessmentId: 12, mark: 12 },
    { userId: 23347863, assessmentId: 13, mark: 18 },
    { userId: 23347863, assessmentId: 14, mark: 4 }
  ];

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
