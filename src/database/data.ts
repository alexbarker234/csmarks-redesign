import { and, eq, inArray } from "drizzle-orm";
import { Assessment, Post, Reply, ReplyDetails, User } from "../types";
import { initDB } from "./db";
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

const db = await initDB();

// Fetch a User by ID
export async function fetchUser(userId: number): Promise<User | null> {
  const result = await db
    .select({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName
    })
    .from(user)
    .where(eq(user.id, userId))
    .get();

  return result || null;
}

// Fetch a User's Enrolled Units
export async function fetchUserEnrolledUnits(
  userId: number
): Promise<{ unitId: string; name: string }[]> {
  const result = await db
    .select({
      unitId: unit.id,
      name: unit.name
    })
    .from(unit)
    .innerJoin(enrolment, eq(enrolment.unitId, unit.id))
    .where(eq(enrolment.userId, userId))
    .all();

  return result.map((row) => ({ unitId: row.unitId, name: row.name }));
}

// Fetch a User's Assessments Across All Units
export async function fetchUserAssessments(
  userId: number
): Promise<{ assessmentId: number; name: string; mark: number | null }[]> {
  const results = await db
    .select({
      assessmentId: assessment.id,
      name: assessment.name,
      mark: result.mark
    })
    .from(assessment)
    .leftJoin(
      result,
      and(eq(result.assessmentId, assessment.id), eq(result.userId, userId))
    )
    .all();

  return results.map((row) => ({
    assessmentId: row.assessmentId,
    name: row.name,
    mark: row.mark
  }));
}

// Fetch a User's Assessments for a Specific Unit
export async function fetchUserAssessmentsForUnit(
  userId: number,
  unitId: string
): Promise<Assessment[]> {
  const results = await db
    .select({
      name: assessment.name,
      mark: result.mark,
      maxMark: assessment.maxMark
    })
    .from(assessment)
    .leftJoin(
      result,
      and(eq(result.assessmentId, assessment.id), eq(result.userId, userId))
    )
    .where(eq(assessment.unitId, unitId))
    .all();

  return results.map((row) => ({
    name: row.name,
    mark: row.mark ?? undefined,
    maxMark: row.maxMark
  }));
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
  const result = await db
    .select({
      assessmentId: assessment.id,
      name: assessment.name,
      maxMark: assessment.maxMark,
      resultsReleased: assessment.resultsReleased
    })
    .from(assessment)
    .where(eq(assessment.unitId, unitId))
    .all();

  return result.map((row) => ({
    assessmentId: row.assessmentId,
    name: row.name,
    maxMark: row.maxMark,
    resultsReleased: Boolean(row.resultsReleased)
  }));
}
// Fetch post details by ID with associated tags and replies
export async function fetchPostDetailsById(
  postId: number
): Promise<Post<ReplyDetails> | null> {
  // Fetch the post details with its likes and title
  const postDetails = await db
    .select({
      id: post.id,
      title: post.title,
      likes: post.likes
    })
    .from(post)
    .where(eq(post.id, postId))
    .get();

  if (!postDetails) {
    return null; // Return null if the post doesn't exist
  }

  // Fetch associated tags for the pos
  const tagsResult = await db
    .select({
      tagName: tag.name
    })
    .from(tag)
    .innerJoin(postTag, eq(tag.id, postTag.tagId))
    .where(eq(postTag.postId, postId))
    .all();

  const tags = tagsResult.map((t) => t.tagName);

  const repliesResult = await db
    .select({
      timestamp: reply.timestamp,
      firstName: user.firstName,
      lastName: user.lastName,
      likes: reply.likes,
      content: reply.content
    })
    .from(reply)
    .innerJoin(user, eq(reply.userId, user.id))
    .where(eq(reply.postId, postId))
    .all();

  const replies: ReplyDetails[] = repliesResult.map((r) => ({
    timestamp: r.timestamp ? new Date(r.timestamp) : new Date(),
    author: r.firstName + " " + r.lastName,
    likes: r.likes,
    content: r.content
  }));

  return {
    id: postDetails.id,
    title: postDetails.title,
    likes: postDetails.likes,
    tags,
    replies
  };
}

export async function fetchPostsInForumByName(
  forumName: string
): Promise<Post<Reply>[]> {
  const posts = await db
    .select({
      postId: post.id,
      title: post.title,
      likes: post.likes
    })
    .from(post)
    .innerJoin(forum, eq(post.forumId, forum.id))
    .where(eq(forum.name, forumName))
    .all();

  if (posts.length === 0) {
    return [];
  }

  const postTags = await db
    .select({
      postId: postTag.postId,
      tagName: tag.name
    })
    .from(tag)
    .innerJoin(postTag, eq(tag.id, postTag.tagId))
    .where(
      inArray(
        postTag.postId,
        posts.map((p) => p.postId)
      )
    )
    .all();

  const tagsByPostId: Record<number, string[]> = {};
  for (const { postId, tagName } of postTags) {
    if (!tagsByPostId[postId]) tagsByPostId[postId] = [];
    tagsByPostId[postId].push(tagName);
  }

  const repliesResult = await db
    .select({
      postId: reply.postId,
      timestamp: reply.timestamp,
      author: user.firstName,
      likes: reply.likes
    })
    .from(reply)
    .innerJoin(user, eq(reply.userId, user.id))
    .where(
      inArray(
        reply.postId,
        posts.map((p) => p.postId)
      )
    )
    .all();

  const repliesByPostId: Record<number, Reply[]> = {};
  for (const r of repliesResult) {
    if (!repliesByPostId[r.postId]) repliesByPostId[r.postId] = [];
    repliesByPostId[r.postId].push({
      timestamp: new Date(r.timestamp),
      author: r.author,
      likes: r.likes
    });
  }

  return posts.map((post) => ({
    id: post.postId,
    title: post.title,
    likes: post.likes,
    tags: tagsByPostId[post.postId] || [],
    replies: repliesByPostId[post.postId] || []
  }));
}
