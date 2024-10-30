CREATE TABLE `Forum` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `Post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`forumId` integer,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`likes` integer DEFAULT 0,
	FOREIGN KEY (`forumId`) REFERENCES `Forum`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `PostTag` (
	`postId` integer,
	`tagId` integer,
	PRIMARY KEY(`postId`, `tagId`),
	FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Reply` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`postId` integer,
	`userId` integer,
	`content` text,
	`timestamp` integer,
	`likes` integer DEFAULT 0,
	FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Tag` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
