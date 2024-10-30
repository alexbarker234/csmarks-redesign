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

    CREATE TABLE IF NOT EXISTS Enrolment (
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
    // Level 1
    { id: "CITS1003", name: "Introduction to Cybersecurity" },
    { id: "CITS1401", name: "Computational Thinking with Python" },
    { id: "CITS1402", name: "Relational Database Management Systems" },
    { id: "CITS1501", name: "Introduction to Programming with Python" },
    // Level 2
    { id: "CITS2002", name: "Systems Programming" },
    { id: "CITS2005", name: "Object Oriented Programming" },
    { id: "CITS2006", name: "Defensive Cybersecurity" },
    { id: "CITS2200", name: "Data Structures and Algorithms" },
    { id: "CITS2211", name: "Discrete Structures" },
    { id: "CITS2401", name: "Computer Analysis and Visualisation" },
    { id: "CITS2402", name: "Introduction to Data Science" },
    // Level 3
    { id: "CITS3001", name: "Advanced Algorithms" },
    { id: "CITS3002", name: "Computer Networks" },
    { id: "CITS3003", name: "Graphics and Animation" },
    { id: "CITS3005", name: "Knowledge Representation" },
    { id: "CITS3006", name: "Penetration Testing" },
    { id: "CITS3007", name: "Secure Coding" },
    { id: "CITS3011", name: "Intelligent Agents" },
    { id: "CITS3200", name: "Professional Computing" },
    { id: "CITS3301", name: "Software Requirements and Design" },
    { id: "CITS3401", name: "Data Warehousing" },
    { id: "CITS3402", name: "High Performance Computing" },
    { id: "CITS3403", name: "Agile Web Development" }
  ];

  // Enrol each user into random units
  const numUnits = 4;
  const enrolments = [];
  for (const user of users) {
    const unitIds = units
      .map((unit) => unit.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, numUnits);

    for (const unitId of unitIds) {
      enrolments.push({ unitId, userId: user.id });
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
    // Select a random assessment set for this unit
    const assessmentSet =
      assessmentSets[Math.floor(Math.random() * assessmentSets.length)];

    // Generate assessments for the current unit
    const unitAssessments = assessmentSet.map((assessmentName, index) => ({
      id: assessments.length + index + 1,
      name: assessmentName,
      unitId: unit.id,
      maxMark: markOptions[Math.floor(Math.random() * markOptions.length)],
      resultsReleased: true // Default to true; we'll adjust the last few after
    }));

    // Determine the number of final assessments to hide (1 to 3)
    const numUnreleased = Math.floor(Math.random() * 3) + 1;

    // Set `resultsReleased` to false for the last `numUnreleased` assessments
    for (
      let i = unitAssessments.length - numUnreleased;
      i < unitAssessments.length;
      i++
    ) {
      unitAssessments[i].resultsReleased = false;
    }

    // Add the unit's assessments to the main assessments array
    assessments.push(...unitAssessments);
  }

  // Generate random marks for each user in their enrolled units
  const results: {
    userId: number;
    assessmentId: number;
    mark: number | null;
  }[] = [];
  for (const enrolment of enrolments) {
    const { userId, unitId } = enrolment;

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
  for (const enrolment of enrolments) {
    db.run(
      `INSERT INTO Enrolment (unitId, userId) VALUES (?, ?)`,
      enrolment.unitId,
      enrolment.userId
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
