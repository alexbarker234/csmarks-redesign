CREATE TABLE `Assessment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`unitId` text,
	`maxMark` integer NOT NULL,
	`resultsReleased` integer NOT NULL,
	FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Enrolment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`unitId` text,
	`userId` integer,
	FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Result` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`assessmentId` integer,
	`mark` integer,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assessmentId`) REFERENCES `Assessment`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Unit` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` integer PRIMARY KEY NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL
);
