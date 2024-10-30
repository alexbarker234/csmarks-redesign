// src/seed.ts
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import { randBetween } from "../utils/random";
import { assessment, enrolment, result, unit, user } from "./schema";

const dbPath = "./public/mock.sqlite";

// Seed data arrays
const users = [
  { id: 23152009, firstName: "Alex", lastName: "Barker" },
  { id: 22847284, firstName: "Jane", lastName: "Smith" },
  { id: 28375637, firstName: "Bob", lastName: "Johnson" }
];

const units = [
  { id: "CITS1003", name: "Introduction to Cybersecurity" },
  { id: "CITS1401", name: "Computational Thinking with Python" },
  { id: "CITS1402", name: "Relational Database Management Systems" },
  { id: "CITS1501", name: "Introduction to Programming with Python" },
  // Level 2 and Level 3 units
  { id: "CITS2002", name: "Systems Programming" },
  { id: "CITS2005", name: "Object Oriented Programming" },
  { id: "CITS2006", name: "Defensive Cybersecurity" },
  { id: "CITS2200", name: "Data Structures and Algorithms" },
  { id: "CITS2211", name: "Discrete Structures" },
  { id: "CITS2401", name: "Computer Analysis and Visualisation" },
  { id: "CITS3001", name: "Advanced Algorithms" },
  { id: "CITS3002", name: "Computer Networks" }
];

const assessmentSets = [
  ["Lab Quiz 1", "Lab Quiz 2", "Lab Quiz 3", "Project 1", "Project 2"],
  ["Midterm Exam", "Final Exam", "Project 1", "Project 2"],
  ["Lab Quiz 1", "Report 1", "Lab Quiz 2", "Report 2", "Lab Quiz 3", "Report 3"]
];

const numUnits = 4;
const markOptions = [20, 40, 60, 80, 100];

const initDB = () => {
  const filePath = path.resolve(dbPath);
  const sqliteDb = new Database(filePath);
  return drizzle(sqliteDb);
};

async function seedDatabase() {
  const db = initDB();

  // Insert Users
  for (const userData of users) {
    await db.insert(user).values(userData).run();
  }

  // Insert Units
  for (const unitData of units) {
    await db.insert(unit).values(unitData).run();
  }

  // Enroll users in random units
  const enrolments = [];
  for (const userData of users) {
    const selectedUnits = units
      .map((u) => u.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, numUnits);

    for (const unitId of selectedUnits) {
      enrolments.push({ unitId, userId: userData.id });
    }
  }
  for (const enrolmentData of enrolments) {
    await db.insert(enrolment).values(enrolmentData).run();
  }

  // Generate assessments for each unit with a random assessment set
  const assessments = [];
  for (const unitData of units) {
    const assessmentSet =
      assessmentSets[Math.floor(Math.random() * assessmentSets.length)];
    const unitAssessments = assessmentSet.map((name, index) => ({
      name,
      unitId: unitData.id,
      maxMark: markOptions[Math.floor(Math.random() * markOptions.length)],
      resultsReleased: 1
    }));

    const numUnreleased = Math.floor(Math.random() * 3) + 1;
    for (
      let i = unitAssessments.length - numUnreleased;
      i < unitAssessments.length;
      i++
    ) {
      unitAssessments[i].resultsReleased = 0;
    }

    assessments.push(...unitAssessments);
  }
  for (const assessmentData of assessments) {
    await db.insert(assessment).values(assessmentData).run();
  }

  // Insert Results with random marks
  const results = [];
  for (const enrolmentData of enrolments) {
    const unitAssessments = assessments.filter(
      (a) => a.unitId === enrolmentData.unitId
    );
    for (const assessmentData of unitAssessments) {
      const mark = assessmentData.resultsReleased
        ? Math.floor(randBetween(0, assessmentData.maxMark))
        : null;
      results.push({
        userId: enrolmentData.userId,
        assessmentId: assessmentData.id,
        mark
      });
    }
  }
  for (const resultData of results) {
    await db.insert(result).values(resultData).run();
  }

  console.log("Database seeded successfully.");
}

seedDatabase().catch((error) => {
  console.error("Error seeding the database:", error);
});
