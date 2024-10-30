import { faker } from "@faker-js/faker";
import Database from "better-sqlite3";
import { exec } from "child_process";
import { InferInsertModel } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { randBetween } from "../utils/random";
import {
  assessment,
  enrolment,
  forum,
  post,
  postTag,
  reply,
  result,
  tag,
  unit,
  user
} from "./schema";

const execAsync = promisify(exec);

const dbPath = "./public/mock.sqlite";

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

export const seedForums = async (db: ReturnType<typeof drizzle>) => {
  const forums = units.map((unit, index) => ({
    id: index + 1,
    name: `help${unit.id.slice(-4)}`,
    description: `Forum for help with ${unit.name}`
  }));

  const tags = [
    "computing",
    "algorithms",
    "data structures",
    "security",
    "web development"
  ];

  const posts: InferInsertModel<typeof post>[] = [];
  const replies = [];
  const postTags = [];
  let postId = 0;
  let replyId = 0;

  for (const forum of forums) {
    const numPostsInForum = faker.number.int({ min: 2, max: 5 });

    for (let i = 0; i < numPostsInForum; i++) {
      const numReplies = faker.number.int({ min: 2, max: 5 });
      const postTagsArray = faker.helpers.arrayElements(
        tags,
        faker.number.int({ min: 1, max: 3 })
      );

      const post = {
        id: postId,
        forumId: forum.id,
        userId: faker.helpers.arrayElement(users).id,
        title: faker.lorem.sentence(),
        likes: faker.number.int({ min: 2, max: 100 })
      };

      posts.push(post);

      // Create reply entries for the post
      for (let j = 0; j < numReplies; j++) {
        replies.push({
          id: replyId,
          postId: post.id,
          userId: faker.helpers.arrayElement(users).id,
          content: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
          timestamp: faker.date.recent({ days: 30 }).getTime(),
          likes: faker.number.int({ min: 1, max: 4 })
        });
        replyId++;
      }

      // Map post-tags for many-to-many relationships
      for (const tagName of postTagsArray) {
        const tagId = tags.indexOf(tagName); // Assuming tag ID matches index in array
        postTags.push({
          postId: post.id,
          tagId
        });
      }

      postId++;
    }
  }

  db.insert(forum).values(forums).run();
  db.insert(tag)
    .values(tags.map((name, i) => ({ id: i, name })))
    .run();
  db.insert(post).values(posts).run();
  db.insert(reply).values(replies).run();
  db.insert(postTag).values(postTags).run();
};

function seedUsers(db: ReturnType<typeof drizzle>) {
  for (const userData of users) {
    db.insert(user).values(userData).run();
  }
}

function seedUnitsAndAssessments(db: ReturnType<typeof drizzle>) {
  // Insert Units
  for (const unitData of units) {
    db.insert(unit).values(unitData).run();
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
    db.insert(enrolment).values(enrolmentData).run();
  }

  // Generate assessments for each unit with a random assessment set
  const assessments: {
    id: number;
    name: string;
    unitId: string;
    maxMark: number;
    resultsReleased: number;
  }[] = [];
  for (const unitData of units) {
    const assessmentSet =
      assessmentSets[Math.floor(Math.random() * assessmentSets.length)];

    const unitAssessments = assessmentSet.map((name) => ({
      name,
      unitId: unitData.id,
      maxMark: markOptions[Math.floor(Math.random() * markOptions.length)],
      resultsReleased: 1, // updated later
      id: -1 // updated later
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

  // Assign each assessment an id
  for (let i = 0; i < assessments.length; i++) {
    assessments[i].id = i + 1;
  }

  for (const assessmentData of assessments) {
    db.insert(assessment).values(assessmentData).run();
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
    db.insert(result).values(resultData).run();
  }
}

async function createDatabase() {
  try {
    console.log("Recreating database...");

    // Jank bc we aren't migrating
    const migrationsPath = "./migrations";
    if (fs.existsSync(migrationsPath)) {
      fs.rmSync(migrationsPath, { recursive: true, force: true });
      console.log("Old migrations folder deleted");
    }

    await execAsync("npx drizzle-kit generate");
    await execAsync("npx drizzle-kit migrate");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function seedDatabase() {
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log("Old database file deleted");
  }
  await createDatabase();

  const db = initDB();
  seedUsers(db);
  seedUnitsAndAssessments(db);
  seedForums(db);

  console.log("Database seeded successfully.");
}

seedDatabase().catch((error) => {
  console.error("Error seeding the database:", error);
});
