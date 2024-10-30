import { relations } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text
} from "drizzle-orm/sqlite-core";

export const user = sqliteTable("User", {
  id: integer("id").primaryKey(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull()
});

export const forum = sqliteTable("Forum", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description")
});

export const post = sqliteTable("Post", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  forumId: integer("forumId").references(() => forum.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  likes: integer("likes").default(0)
});

export const reply = sqliteTable("Reply", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postId: integer("postId").references(() => post.id),
  userId: integer("userId").references(() => user.id),
  content: text("content"),
  timestamp: integer("timestamp"),
  likes: integer("likes").default(0)
});

export const tag = sqliteTable("Tag", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull()
});

export const postTag = sqliteTable(
  "PostTag",
  {
    postId: integer("postId").references(() => post.id),
    tagId: integer("tagId").references(() => tag.id)
  },
  (table) => {
    return {
      primaryKey: primaryKey({ columns: [table.postId, table.tagId] })
    };
  }
);

export const unit = sqliteTable("Unit", {
  id: text("id").primaryKey(),
  name: text("name").notNull()
});

export const enrolment = sqliteTable("Enrolment", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  unitId: text("unitId").references(() => unit.id),
  userId: integer("userId").references(() => user.id)
});

export const assessment = sqliteTable("Assessment", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  unitId: text("unitId").references(() => unit.id),
  maxMark: integer("maxMark").notNull(),
  resultsReleased: integer("resultsReleased").notNull()
});

export const result = sqliteTable("Result", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").references(() => user.id),
  assessmentId: integer("assessmentId").references(() => assessment.id),
  mark: integer("mark")
});

export const userRelations = relations(user, ({ many }) => ({
  enrolments: many(enrolment),
  results: many(result),
  replies: many(reply)
}));

export const forumRelations = relations(forum, ({ many }) => ({
  posts: many(post)
}));

export const postRelations = relations(post, ({ one, many }) => ({
  forum: one(forum, { fields: [post.forumId], references: [forum.id] }),
  replies: many(reply),
  tags: many(postTag)
}));

export const replyRelations = relations(reply, ({ one }) => ({
  post: one(post, { fields: [reply.postId], references: [post.id] }),
  user: one(user, { fields: [reply.userId], references: [user.id] })
}));

export const tagRelations = relations(tag, ({ many }) => ({
  postTags: many(postTag)
}));

export const postTagRelations = relations(postTag, ({ one }) => ({
  post: one(post, { fields: [postTag.postId], references: [post.id] }),
  tag: one(tag, { fields: [postTag.tagId], references: [tag.id] })
}));

export const unitRelations = relations(unit, ({ many }) => ({
  enrolments: many(enrolment),
  assessments: many(assessment)
}));

export const enrolmentRelations = relations(enrolment, ({ one }) => ({
  user: one(user, { fields: [enrolment.userId], references: [user.id] }),
  unit: one(unit, { fields: [enrolment.unitId], references: [unit.id] })
}));

export const assessmentRelations = relations(assessment, ({ one, many }) => ({
  unit: one(unit, { fields: [assessment.unitId], references: [unit.id] }),
  results: many(result)
}));

export const resultRelations = relations(result, ({ one }) => ({
  user: one(user, { fields: [result.userId], references: [user.id] }),
  assessment: one(assessment, {
    fields: [result.assessmentId],
    references: [assessment.id]
  })
}));
