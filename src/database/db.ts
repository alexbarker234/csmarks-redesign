import initSqlJs, { Database, QueryExecResult } from "sql.js";
import { Assessment, Post, Reply, ReplyDetails, User } from "../types";

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
    JOIN Enrollment ON Unit.id = Enrollment.unitId 
    WHERE Enrollment.userId = ?
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

export async function fetchPostsInForumByName(
  forumName: string
): Promise<Post<Reply>[]> {
  const db = await initDB();

  // Fetch posts with their tags and likes, plus replies without content
  const result: QueryExecResult[] = db.exec(
    `
    SELECT 
      Post.id AS postId, 
      Post.title, 
      Post.likes, 
      GROUP_CONCAT(Tag.name) AS tags,
      Reply.timestamp, 
      User.firstName || ' ' || User.lastName AS author,
      Reply.likes AS replyLikes
    FROM Post
    JOIN Forum ON Post.forumId = Forum.id
    LEFT JOIN Reply ON Post.id = Reply.postId
    LEFT JOIN User ON Reply.userId = User.id
    LEFT JOIN PostTag ON Post.id = PostTag.postId
    LEFT JOIN Tag ON PostTag.tagId = Tag.id
    WHERE Forum.name = ?
    GROUP BY Post.id, Post.title, Post.likes, Reply.timestamp, User.firstName, User.lastName
    ORDER BY Post.id, Reply.timestamp
  `,
    [forumName]
  );

  // Organize data by post and reply
  const postsMap = new Map<number, Post<Reply>>();

  result[0]?.values.forEach((row) => {
    const postId = row[0] as number;
    const postTitle = row[1] as string;
    const postLikes = row[2] as number;
    const tags = (row[3] as string)?.split(",") ?? [];
    const replyTimestamp = row[4] as string;
    const replyAuthor = row[5] as string;
    const replyLikes = row[6] as number;

    // If post is not yet added, initialize it
    if (!postsMap.has(postId)) {
      postsMap.set(postId, {
        id: postId,
        title: postTitle,
        replies: [],
        likes: postLikes,
        tags: tags
      });
    }

    // Add reply data if it exists
    if (replyTimestamp && replyAuthor) {
      postsMap.get(postId)?.replies.push({
        timestamp: replyTimestamp,
        author: replyAuthor,
        likes: replyLikes
      });
    }
  });

  return Array.from(postsMap.values());
}

export async function fetchPostDetailsById(
  postId: number
): Promise<Post<ReplyDetails> | null> {
  const db = await initDB();

  // Fetch post details and associated replies
  const result: QueryExecResult[] = db.exec(
    `
    SELECT 
      Post.id AS postId, 
      Post.title, 
      Post.likes, 
      GROUP_CONCAT(Tag.name) AS tags,
      Reply.timestamp, 
      User.firstName || ' ' || User.lastName AS author,
      Reply.likes AS replyLikes,
      Reply.content AS replyContent
    FROM Post
    LEFT JOIN Reply ON Post.id = Reply.postId
    LEFT JOIN User ON Reply.userId = User.id
    LEFT JOIN PostTag ON Post.id = PostTag.postId
    LEFT JOIN Tag ON PostTag.tagId = Tag.id
    WHERE Post.id = ?
    GROUP BY Post.id, Post.title, Post.content, Post.likes, Reply.timestamp, Reply.author
    ORDER BY Reply.timestamp
  `,
    [postId]
  );

  if (result.length === 0 || result[0].values.length === 0) {
    return null; // No post found
  }

  const rows = result[0].values;

  // Map the first row for the post data and group replies
  const postDetails: Post<ReplyDetails> = {
    id: rows[0][0] as number,
    title: rows[0][1] as string,
    likes: rows[0][3] as number,
    tags: (rows[0][4] as string)?.split(",") || [],
    replies: rows
      .map((row) => ({
        timestamp: row[5] as string,
        author: row[6] as string,
        likes: row[7] as number,
        content: row[8] as string
      }))
      .filter((reply) => reply.author && reply.content) // Exclude rows without reply data
  };

  return postDetails;
}
