import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("User", {
  id: integer("id").primaryKey(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull()
});

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
  results: many(result)
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
