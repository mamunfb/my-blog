CREATE TABLE `commentRatings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`commentId` int NOT NULL,
	`rating` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `commentRatings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `postDrafts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`excerpt` varchar(500),
	`featuredImageUrl` varchar(500),
	`data` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `postDrafts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `socialSharingMetrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`platform` varchar(50) NOT NULL,
	`shareCount` int NOT NULL DEFAULT 0,
	`clickCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `socialSharingMetrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `commentRatings` ADD CONSTRAINT `commentRatings_commentId_comments_id_fk` FOREIGN KEY (`commentId`) REFERENCES `comments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `postDrafts` ADD CONSTRAINT `postDrafts_postId_posts_id_fk` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `postDrafts` ADD CONSTRAINT `postDrafts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `socialSharingMetrics` ADD CONSTRAINT `socialSharingMetrics_postId_posts_id_fk` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;